import type { Post } from "@prisma/client";
import { format } from "date-fns";

import Link from "next/link";
import { Card } from "react-bootstrap";

interface Author {
  username: string;
  id: string;
  profileImageUrl: string;
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

export default DisplayData;
