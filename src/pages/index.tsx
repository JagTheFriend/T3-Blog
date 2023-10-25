import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import Navbar from "~/component/Navbar";
import { api } from "~/utils/api";

type DisplayDataProps = {
  data:
    | {
        post: {
          id: string;
          title: string;
          content: string;
          authorId: string;
          hasEdited: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
        author: {
          username: string;
          id: string;
          profileImageUrl: string;
        };
      }[]
    | undefined;
};

function DisplayData({ data }: DisplayDataProps) {
  const { isSignedIn, user } = useUser();
  return <>{isSignedIn ? `Welcome ${user.username}!` : ""}</>;
}

function LoadingPage() {
  return <></>;
}

function Home() {
  const { data, isLoading, isError } = api.post.getPosts.useQuery();

  if (isError) {
    toast.error("Failed to retrieve post! Please try again later.");
  }

  return (
    <>
      <Head>
        <title>T3 Blog</title>
        <meta name="description" content="Simple blog made using T3-Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Container>
        {isLoading ? <LoadingPage /> : <DisplayData data={data} />}
      </Container>
    </>
  );
}

export default Home;
