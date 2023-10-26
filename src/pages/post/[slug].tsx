import { useUser } from "@clerk/nextjs";
import type { TRPCError } from "@trpc/server";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
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
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = api.comment.createComment.useMutation({
    onError: (error) => {
      toast.error(error.message);
      setIsLoading(false);
    },
    onSuccess: () => {
      toast.success("Comment created successfully!");
      setIsLoading(false);
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

function DisplayComments({ postId }: { postId: string }) {
  const { data, isError, isLoading } = api.comment.getComments.useQuery({
    postId,
  });
  console.log("🚀 ~ file: [slug].tsx:84 ~ DisplayComments ~ data:", data);

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
      <Head>
        <title>T3 Blog</title>
        <meta name="description" content="Simple blog made using T3-Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavbarComponent />
      {isLoading ? <LoadingPage /> : <ViewPostDetail data={data} />}
    </>
  );
}

export const getStaticProps: GetStaticProps = (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");
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
