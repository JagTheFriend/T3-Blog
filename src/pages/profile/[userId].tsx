import type { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect } from "react";
import toast from "react-hot-toast";
import LoadingPage from "~/component/LoadingPage";
import NavbarComponent from "~/component/Navbar";
import DisplayData from "~/component/ViewBlog";
import { api } from "~/utils/api";

function HeaderComponent({ username }: { username: string }) {
  return (
    <Head>
      <title>Blogs made by {username ?? "Unknown"}</title>
      <meta
        name="description"
        content={`Blogs created by ${username ?? "Unknown"}`}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

function DisplayUsername({ username }: { username: string }) {
  return (
    <div className="header" style={{ textAlign: "center" }}>
      <h4>Posts made by: {username}</h4>
    </div>
  );
}

function GetPostsByUserId({ userId }: { userId: string }) {
  const { data, isLoading, isError, isFetched } =
    api.post.getPostByUserId.useQuery({
      userId,
    });

  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    isFetched: userIsFetched,
  } = api.user.getUserById.useQuery({
    userId,
  });

  useEffect(() => {
    if (isError && isFetched) {
      toast.error("Unable to retrieve posts. Please try again later");
    }
  }, [isError, isFetched]);

  useEffect(() => {
    if (userIsError && userIsFetched) {
      toast.error("Unable to user data. Please try again later");
    }
  }, [userIsError, userIsFetched]);

  return (
    <>
      <NavbarComponent />
      {isLoading || userIsLoading ? (
        <LoadingPage />
      ) : (
        <>
          <HeaderComponent username={userData?.username ?? "Unknown"} />
          <div className="mt-3">
            <DisplayUsername username={userData?.username ?? "Unknown"} />
            <hr />
            <DisplayData data={data} />
          </div>
        </>
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
