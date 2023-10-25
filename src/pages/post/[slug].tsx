import type { Post } from "@prisma/client";
import type { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { sanitize } from "dompurify";
import type { GetStaticProps } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import toast from "react-hot-toast";
import { Converter } from "showdown";
import LoadingPage from "~/component/LoadingPage";
import NavbarComponent from "~/component/Navbar";
import { api } from "~/utils/api";

type DataType = {
  post: Post;
  author: {
    username: string;
    id: string;
    profileImageUrl: string;
  };
};

type ViewPostDetailType = {
  data: TRPCError | DataType | undefined;
};

function ViewPostDetail({ data }: ViewPostDetailType) {
  if (!data) return <></>;

  const { post, author } = data as DataType;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const date: string = format(new Date(post.createdAt), "dd/MM/yyyy");

  const converter = new Converter();
  const postContent = sanitize(converter.makeHtml(post.content));

  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>{post.title}</h3>
        by {author.username} at {date}
      </div>
      <hr />
      Description: {post.description}
      <hr />
      <div dangerouslySetInnerHTML={{ __html: postContent }}></div>
      <Link
        href="/"
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

  useEffect(() => {
    if (!data && isFetched) {
      notFound();
    }
  }, [data, isFetched]);

  return (
    <>
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
