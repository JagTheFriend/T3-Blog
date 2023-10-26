import type { Post } from "@prisma/client";
import type { TRPCError } from "@trpc/server";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import toast from "react-hot-toast";
import DisplayBlogContent from "~/component/DisplayBlogContent";
import LoadingPage from "~/component/LoadingPage";
import NavbarComponent from "~/component/Navbar";
import { api } from "~/utils/api";

function DisplayComments({ postId }: { postId: string }) {
  const { data, isError, isLoading } = api.comment.getComments.useQuery({
    postId,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Cannot load comments");
    }
  }, [isError]);

  return <></>;
}

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
