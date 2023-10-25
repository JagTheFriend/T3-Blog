import { useLayoutEffect, useRef, useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavbarComponent from "~/component/Navbar";

function CreatePost() {
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogContent, setBlogContent] = useState<string>("");

  const blogContentTextbox = useRef<HTMLTextAreaElement>(null);

  function adjustHeight() {
    blogContentTextbox.current!.style.height = `${
      blogContentTextbox.current!.scrollHeight
    }px`;
  }

  useLayoutEffect(adjustHeight, []);

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
        <FloatingLabel label="Blog Content">
          <Form.Control
            as="textarea"
            id="blogInputTextArea"
            placeholder="Enter content of the blog (markdown is supported)"
            style={{ height: "30px" }}
            ref={blogContentTextbox}
            onChange={(e) => {
              setBlogContent(e.target.value);
              adjustHeight();
            }}
          />
        </FloatingLabel>
      </Container>
    </>
  );
}

export default CreatePost;
