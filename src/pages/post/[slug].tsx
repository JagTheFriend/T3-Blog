import type { GetStaticProps } from "next";
import { Container } from "react-bootstrap";

function ViewPost({ slug }: { slug: string }) {
  return (
    <>
      <Container>{slug}</Container>
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
