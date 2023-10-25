import type { Post } from "@prisma/client";
import type { TRPCError } from "@trpc/server";
import type { GetStaticProps } from "next";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import toast from "react-hot-toast";
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
  data: TRPCError | DataType[];
};

function ViewPostDetail({ data }: ViewPostDetailType) {
  console.log(data);
  return <Container>{1}</Container>;
}

function ViewPost({ slug }: { slug: string }) {
  const { isLoading, data, isError } = api.post.getPostBySlug.useQuery({
    slug,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to retrieve post! Please try again later.");
    }
  }, [isError]);

  return (
    <>
      <NavbarComponent />
      {isLoading ? "" : isError ? "" : <ViewPostDetail data={data} />}
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
