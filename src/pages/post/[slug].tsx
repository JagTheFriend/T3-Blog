import { useUser } from "@clerk/nextjs";
import type { Comment } from "@prisma/client";
import type { TRPCError } from "@trpc/server";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";
import DisplayBlogContent, {
  type DataType,
} from "~/component/DisplayBlogContent";
import LoadingPage from "~/component/LoadingPage";
import NavbarComponent from "~/component/Navbar";
import { api } from "~/utils/api";

type CreateCommentProps = {
  postId: string;
};

function CreateComment({ postId }: CreateCommentProps) {
  const { user } = useUser();
  const ctx = api.useUtils();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = api.comment.createComment.useMutation({
    onError: () => {
      toast.error("Something went wrong. Pleas try again later!");
      setIsLoading(false);
    },
    onSuccess: () => {
      setComment("");
      setIsLoading(false);
      toast.success("Comment created successfully!");
      void ctx.comment.getComments.invalidate();
    },
  });

  const [comment, setComment] = useState("");

  const postComment = () => {
    if (comment.trim().length == 0) {
      return toast.error("Provide comment");
    }

    if (!user) {
      toast.error("Please sign-in to post the comment.");
      return toast.error("Note: Copy comment before leaving this page");
    }
    setIsLoading(true);
    mutate({
      content: comment,
      postId: postId,
      authorId: user.id,
    });
  };

  return (
    <>
      <FloatingLabel
        controlId="commentInput"
        label="Write a comment"
        className="mb-2 mt-3"
      >
        <Form.Control
          type="text"
          disabled={isLoading}
          value={comment}
          placeholder="Write a comment"
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
      </FloatingLabel>
      <Button
        variant="outline-success"
        onClick={() => postComment()}
        disabled={isLoading}
      >
        Post
      </Button>
    </>
  );
}

function DeleteButton({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) {
  const ctx = api.useUtils();
  const { user } = useUser();

  // Check if userId of the author of comment === current userId
  if (userId !== user?.id) {
    return <></>;
  }

  const { mutate, isLoading } = api.comment.deleteComment.useMutation({
    onError: () => {
      toast.error("Something went wrong. Pleas try again later!");
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully!");
      void ctx.comment.getComments.invalidate();
    },
  });

  const deleteComment = () => {
    mutate({
      commentId,
    });
  };

  return (
    <>
      <br />
      <Button
        style={{ marginLeft: "40px" }}
        variant="outline-danger"
        disabled={isLoading}
        onClick={() => deleteComment()}
      >
        Delete
      </Button>
    </>
  );
}

type DisplayCommentContentProps = {
  receivedComment: {
    comment: Comment;
    author: { username: string; id: string; profileImageUrl: string };
  };
};

function DisplayCommentContent({
  receivedComment,
}: DisplayCommentContentProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Image
        alt="Profile Image"
        src={receivedComment.author.profileImageUrl}
        width={30}
        height={30}
        style={{
          borderRadius: "50%",
          marginRight: "5px",
        }}
      />
      {receivedComment.author.username}: {receivedComment.comment.content}
      <DeleteButton
        userId={receivedComment.author.id}
        commentId={receivedComment.comment.id}
      />
      <hr />
    </div>
  );
}

function DisplayComments({ postId }: { postId: string }) {
  const { data, isError, isLoading } = api.comment.getComments.useQuery({
    postId,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Cannot load comments");
    }
  }, [isError]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <CreateComment postId={postId} />
      <hr />
      {!data ? (
        ""
      ) : (
        <ListGroup className="mt-3">
          {data.map((receivedData) => (
            <DisplayCommentContent
              key={receivedData.comment.id}
              receivedComment={receivedData}
            />
          ))}
        </ListGroup>
      )}
    </>
  );
}

type ViewPostDetailType = {
  data: TRPCError | DataType | undefined;
};

function ViewPostDetail({ data }: ViewPostDetailType) {
  if (!data) return <></>;

  const { post, author } = data as DataType;

  return (
    <Container>
      <DisplayBlogContent post={post} author={author} goBackUrl={"/"} />
      <DisplayComments postId={post.id} />
    </Container>
  );
}

function ViewPost({ slug }: { slug: string }) {
  const { isLoading, data, isError, isFetched } =
    api.post.getPostBySlug.useQuery({
      slug,
    });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to retrieve post! Please try again later.");
    }
  }, [isError]);

  if (!data && isFetched) {
    return <div>404: Not Found</div>;
  }

  return (
    <>
      <NavbarComponent />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Head>
            <title>{`${(data as DataType).post.title} by ${
              (data as DataType).author.username ?? "Unknown"
            }`}</title>
            <meta
              name="description"
              content={(data as DataType).post.description}
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <ViewPostDetail data={data} />
        </>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No Slug");
  return {
    props: {
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ViewPost;
