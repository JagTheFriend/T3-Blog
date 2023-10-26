import { useUser } from "@clerk/nextjs";
import type { Post } from "@prisma/client";
import { format } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import LoadingPage from "~/component/LoadingPage";
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

type DisplayPostCardProps = {
  data: {
    post: Post;
    author: Author;
  };
};

function DisplayPostCard({ data }: DisplayPostCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const date: string = format(new Date(data.post.createdAt), "dd/MM/yyyy");
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Card.Title>{data.post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          By {data.author.username} at {date}
        </Card.Subtitle>
        <Card.Text style={{ textAlign: "center" }}>
          {data.post.description}
        </Card.Text>
        <Link
          href={`/post/${data.post.slug}`}
          className="card-link"
          style={{
            background: "none !important",
            border: "none",
            padding: "0 !important",
            color: "#069",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Read More
        </Link>
      </Card.Body>
    </Card>
  );
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
    <div
      style={{
        display: "flex",
        gridGap: "2rem",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {data?.map((post) => (
        <DisplayPostCard key={post.post.id} data={post} />
      ))}
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
