import { useUser } from "@clerk/nextjs";
import type { Post } from "@prisma/client";
import { format } from "date-fns";
import { sanitize } from "dompurify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { Converter } from "showdown";
import { api } from "~/utils/api";

function DeletePost({
  authorId,
  postId,
}: {
  authorId: string;
  postId: string;
}) {
  const router = useRouter();
  const { user } = useUser();
  // Check if userId of the author of post === current userId
  if (user?.id !== authorId) {
    return <></>;
  }

  const { mutate, isLoading } = api.post.deletePost.useMutation({
    onError: () => {
      toast.error("Something went wrong. Please try again later!");
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      router.push("/");
    },
  });

  const deletePost = () => {
    mutate({
      postId,
    });
  };

  return (
    <Button
      variant="outline-danger"
      onClick={() => deletePost()}
      disabled={isLoading}
    >
      Delete Post
    </Button>
  );
}

export type DataType = {
  post: Post;
  author: {
    username: string;
    id: string;
    profileImageUrl: string;
  };
  goBackUrl?: string;
};

function DisplayBlogContent({ post, author, goBackUrl = "/" }: DataType) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const date: string = format(new Date(post.createdAt), "dd/MM/yyyy");

  const converter = new Converter();
  const postContent = sanitize(converter.makeHtml(post.content));

  return (
    <>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>{post.title}</h3>
        <div>
          By{" "}
          <Link
            href={`/profile/${author.id}`}
            style={{
              background: "none !important",
              border: "none",
              padding: "0 !important",
              color: "#069",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {author.username}
          </Link>{" "}
          at {date}
        </div>

        <DeletePost authorId={author.id} postId={post.id} />
      </div>
      <hr />
      Description: {post.description}
      <hr />
      <div dangerouslySetInnerHTML={{ __html: postContent }}></div>
      <Link
        href={goBackUrl}
        style={{
          background: "none !important",
          border: "none",
          padding: "0 !important",
          color: "#069",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        ← Go Back
      </Link>
    </>
  );
}

export default DisplayBlogContent;
