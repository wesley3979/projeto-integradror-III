import { Pages } from "../routes/Pages";
import { Row, Col } from "react-bootstrap";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <Row>
        {(window.location.pathname != "/" && window.location.pathname != "/login" && window.location.pathname != "/register") ? <Header /> : ""}
        <Col md={{ span: 10, offset: 1 }}>
          <Pages />
        </Col>
      </Row>
    </div>
  );
};
