import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
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
        <Link className="navbar-brand" href="/">
          T3 Blog
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <NavDropdown title="Action" id="basic-nav-dropdown">
              <NavDropdown.Item>
                <Link href="/create">Create Post</Link>
              </NavDropdown.Item>
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
