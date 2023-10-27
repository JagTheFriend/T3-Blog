import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import LoadingPage from "~/component/LoadingPage";
import Navbar from "~/component/Navbar";
import DisplayData from "~/component/ViewBlog";
import { api } from "~/utils/api";

function DisplayUserName() {
  const { isSignedIn, user } = useUser();
  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        textDecoration: "underline",
      }}
    >
      {isSignedIn
        ? `Welcome ${
            user.username ?? `${user.firstName} ${user.lastName}` ?? "Unknown"
          }!`
        : ""}
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
