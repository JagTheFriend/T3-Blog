import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

function NavbarComponent() {
  const { isSignedIn } = useAuth();
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand href="/">T3 Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Action" id="basic-nav-dropdown">
              <NavDropdown.Item href="/create">Create Post</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">My Posts</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <div className="d-flex">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                afterMultiSessionSingleSignOutUrl="/"
                afterSwitchSessionUrl="/"
                signInUrl="/sign-in"
              />
            ) : (
              <SignInButton afterSignInUrl="/" afterSignUpUrl="/">
                <Button variant="outline-success">Sign In</Button>
              </SignInButton>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
