import { Pages } from "../routes/Pages"
import { Row, Col } from "react-bootstrap"
import { Header } from "./Header"

export const Layout = () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <Header />
      <Row >
        <Col md={{ span:10, offset: 1 }}>
          <Pages /> 
        </Col>
      </Row>
    </div>
  )
}