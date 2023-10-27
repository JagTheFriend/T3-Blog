import type { GetStaticProps } from "next";

function GetPostsByUserId({ userId }: { userId: string }) {
  return <>{userId}</>;
}

export const getStaticProps: GetStaticProps = (context) => {
  const userId = context.params?.userId;

  if (typeof userId !== "string") throw new Error("No UserId");
  return {
    props: {
      userId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default GetPostsByUserId;
