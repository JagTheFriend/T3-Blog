import type { GetStaticProps } from "next";
import { useEffect } from "react";
import toast from "react-hot-toast";
import LoadingPage from "~/component/LoadingPage";
import NavbarComponent from "~/component/Navbar";
import { api } from "~/utils/api";
import { DisplayData } from "..";

function GetPostsByUserId({ userId }: { userId: string }) {
  const { data, isLoading, isError, isFetched } =
    api.post.getPostByUserId.useQuery({
      userId,
    });

  useEffect(() => {
    if (isError && isFetched) {
      toast.error("Unable to retrieve posts. Please try again later");
    }
  }, [isError, isFetched]);

  return (
    <>
      <NavbarComponent />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="mt-3">
          <DisplayData data={data} />
        </div>
      )}
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
