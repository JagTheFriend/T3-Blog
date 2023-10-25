import { useAuth } from "@clerk/nextjs";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

function NavbarComponent() {
  const { isSignedIn } = useAuth();
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">T3 Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <NavDropdown title="Action" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                Create Post
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">My Posts</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
