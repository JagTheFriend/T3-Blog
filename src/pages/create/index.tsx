import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import DisplayBlogContent, { DataType } from "~/component/DisplayBlogContent";
import FooterButtons from "~/component/FooterButtons";
import NavbarComponent from "~/component/Navbar";
import { api } from "~/utils/api";

type DisplayPreviewModalProps = {
  show: boolean;
  handleClose: () => void;
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
};

function DisplayPreviewModal({
  show,
  handleClose,
  blogTitle,
  blogDescription,
  blogContent,
}: DisplayPreviewModalProps) {
  const { user } = useUser();

  const data: DataType = {
    post: {
      content: blogContent,
      description: blogDescription,
      title: blogTitle,
      hasEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: "",
      id: "",
      slug: "",
    },
    author: {
      username: user?.username ?? "Unknown",
      id: "",
      profileImageUrl: user?.imageUrl ?? "",
    },
    goBackUrl: "#",
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      fullscreen={true}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Preview of blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <DisplayBlogContent
            post={data.post}
            author={data.author}
            goBackUrl={data.goBackUrl}
          />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function CreatePost() {
  const router = useRouter();
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogDescription, setBlogDescription] = useState<string>("");
  const [blogContent, setBlogContent] = useState<string>("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const blogContentTextbox = useRef<HTMLTextAreaElement>(null);

  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      setBlogTitle("");
      setBlogContent("");
      router.push("/");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const postBlog = () => {
    if (blogTitle.trim().length == 0) {
      return toast.error("Provide blog title");
    }

    if (blogDescription.trim().length == 0) {
      return toast.error("Provide blog description");
    }

    if (blogContent.trim().length == 0) {
      return toast.error("Provide blog content");
    }

    return mutate({
      title: blogTitle,
      content: blogContent,
      description: blogDescription,
    });
  };

  useIsomorphicLayoutEffect(() => {
    if (blogContentTextbox?.current) {
      blogContentTextbox.current.style.height = "0px";
      const currentHeight = blogContentTextbox.current.scrollHeight;
      blogContentTextbox.current.style.height = currentHeight + "px";
    }
  }, [blogContent]);

  return (
    <>
      <Head>
        <title>Create T3 Blog</title>
        <meta name="description" content="Create a new post" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarComponent />

      <DisplayPreviewModal
        handleClose={handleClose}
        show={show}
        blogTitle={blogTitle}
        blogDescription={blogDescription}
        blogContent={blogContent}
      />

      <Container>
        <FloatingLabel
          controlId="blogTitleInput"
          label="Blog Title"
          className="mb-3 mt-3"
        >
          <Form.Control
            value={blogTitle}
            disabled={isLoading}
            type="text"
            placeholder="Enter title of the blog"
            onChange={(e) => {
              setBlogTitle(e.target.value);
            }}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="blogDescriptionInput"
          label="Blog Description"
          className="mb-3 mt-3"
        >
          <Form.Control
            value={blogDescription}
            disabled={isLoading}
            type="text"
            placeholder="Enter description of the blog"
            onChange={(e) => {
              setBlogDescription(e.target.value);
            }}
          />
        </FloatingLabel>

        <FloatingLabel label="Blog Content" controlId="blogContentInput">
          <Form.Control
            value={blogContent}
            disabled={isLoading}
            className="mb-3"
            as="textarea"
            placeholder="Enter content of the blog (markdown is supported)"
            style={{ height: "30px" }}
            ref={blogContentTextbox}
            onChange={(e) => {
              setBlogContent(e.target.value);
            }}
          />
        </FloatingLabel>

        <FooterButtons>
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Button
                disabled={isLoading}
                onClick={() => handleShow()}
                variant="outline-primary"
              >
                Preview
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => postBlog()}
                variant="outline-success"
              >
                Post
              </Button>
            </>
          )}
        </FooterButtons>
      </Container>
    </>
  );
}

export default CreatePost;
