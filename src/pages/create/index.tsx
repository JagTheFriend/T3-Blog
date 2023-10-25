import { useLayoutEffect, useRef, useState } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import FooterButtons from "~/component/FooterButtons";
import NavbarComponent from "~/component/Navbar";

function CreatePost() {
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogContent, setBlogContent] = useState<string>("");

  const blogContentTextbox = useRef<HTMLTextAreaElement>(null);

  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      setBlogTitle("");
      setBlogContent("");
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
    return mutate({
      title: blogTitle,
      content: blogContent,
    });
  };

  useLayoutEffect(() => {
    if (blogContentTextbox?.current) {
      blogContentTextbox.current.style.height = "0px";
      const currentHeight = blogContentTextbox.current.scrollHeight;
      blogContentTextbox.current.style.height = currentHeight + "px";
    }
  }, [blogContent]);

  return (
    <>
      <NavbarComponent />
      <Container>
        <FloatingLabel
          controlId="blogTitleInput"
          label="Blog Title"
          className="mb-3 mt-3"
        >
          <Form.Control
            type="email"
            placeholder="Enter title of the blog"
            onChange={(e) => {
              setBlogTitle(e.target.value);
            }}
          />
        </FloatingLabel>
        <FloatingLabel label="Blog Content" controlId="blogContentInput">
          <Form.Control
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
          <Button variant="outline-primary">Preview</Button>
          <Button variant="outline-success">Post</Button>
        </FooterButtons>
      </Container>
    </>
  );
}

export default CreatePost;
