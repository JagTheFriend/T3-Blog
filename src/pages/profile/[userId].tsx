import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server/clerkClient";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingPage from "~/component/LoadingPage";
import NavbarComponent from "~/component/Navbar";
import DisplayData from "~/component/ViewBlog";
import { api } from "~/utils/api";

function GetPostsByUserId({ userId }: { userId: string }) {
  const { data, isLoading, isError, isFetched } =
    api.post.getPostByUserId.useQuery({
      userId,
    });

  const [userDetail, setUserDetail] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const response = await clerkClient.users.getUser(userId);
      setUserDetail(response);
    };
    getUser().catch((_error) =>
      toast.error("An error ocurred while fetching user detail")
    );
  }, [userId]);

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
        <>
          <Head>
            <title>
              Blogs made by{" "}
              {data?.[0]?.author?.username ??
                userDetail?.username ??
                `${userDetail?.firstName} ${userDetail?.lastName}` ??
                "Unknown"}
            </title>
            <meta
              name="description"
              content={`Blogs created by ${
                data?.[0]?.author?.username ?? "Unknown"
              }`}
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className="mt-3">
            <div className="header" style={{ textAlign: "center" }}>
              <h4>Posts made by: {data?.[0]?.author?.username ?? "Unknown"}</h4>
            </div>
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
