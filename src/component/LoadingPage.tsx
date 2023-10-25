import { Spinner } from "react-bootstrap";

function LoadingPage() {
  return (
    <div
      style={{
        marginTop: "30px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

export default LoadingPage;
