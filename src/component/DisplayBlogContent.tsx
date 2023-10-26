import type { Post } from "@prisma/client";
import { format } from "date-fns";
import { sanitize } from "dompurify";
import Link from "next/link";
import { Converter } from "showdown";

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
        By {author.username} at {date}
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
