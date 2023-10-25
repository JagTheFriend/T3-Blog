import { useUser } from "@clerk/nextjs";
import type { Post } from "@prisma/client";
import Head from "next/head";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import Navbar from "~/component/Navbar";
import { api } from "~/utils/api";

interface Author {
  username: string;
  id: string;
  profileImageUrl: string;
}

function DisplayUserName() {
  const { isSignedIn, user } = useUser();
  return (
    <div
      style={{
        marginTop: "20px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {isSignedIn ? `Welcome ${user.username}!` : ""}
    </div>
  );
}

type DisplayPostCardProps = {
  data: {
    post: Post;
    author: Author;
  };
};

function DisplayPostCard({ data }: DisplayPostCardProps) {
  return <></>;
}

type DisplayDataProps = {
  data:
    | {
        post: Post;
        author: Author;
      }[]
    | undefined;
};

function DisplayData({ data }: DisplayDataProps) {
  return (
    <>
      {data?.map((post) => (
        <DisplayPostCard key={post.post.id} data={post} />
      ))}
    </>
  );
}

function LoadingPage() {
  return (
    <div
      style={{
        marginTop: "30px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

function Home() {
  const { data, isLoading, isError } = api.post.getPosts.useQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to retrieve post! Please try again later.");
    }
  }, [isError]);

  return (
    <>
      <Head>
        <title>T3 Blog</title>
        <meta name="description" content="Simple blog made using T3-Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Container>
        <DisplayUserName />
        {isLoading ? <LoadingPage /> : <DisplayData data={data} />}
      </Container>
    </>
  );
}

export default Home;
