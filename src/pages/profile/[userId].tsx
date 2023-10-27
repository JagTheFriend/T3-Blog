import type { GetStaticProps } from "next";
import NavbarComponent from "~/component/Navbar";

function GetPostsByUserId({ userId }: { userId: string }) {
  return (
    <>
      <NavbarComponent />
      {userId}
    </>
  );
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
