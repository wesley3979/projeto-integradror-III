import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { ReactComponent as LoginSvg } from "../../assets/loginIcon.svg"
import { ReactComponent as TorneioIcon } from "../../assets/torneioIcon.svg"
import { api } from "../../services/api"
import { useUser } from "../../providers/userContext"
import "./style.css"
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"

export const Register = () => {
  const [registerName, setRegisterName] = useState();
  const [registerEmail, setRegisterEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const { setUserId, setToken } = useUser();
  const history = useHistory()

  const handlerName = ({ target }) => {
    let { value } = target
    setRegisterName(value);
  }

  const handlerEmail = ({ target }) => {
    let { value } = target
    setRegisterEmail(value);
  }

  const handlerPassword = ({ target }) => {
    let { value } = target
    setPassword(value);
  }

  const handlerConfirmPassword = ({ target }) => {
    let { value } = target
    setConfirmPassword(value);
  }

  const handlerSubmit = async () => {
    const obj = {
      name: registerName,
      email: registerEmail,
      password,
      confirmpassword: confirmPassword
    }
    try {
      let res = await api.post('/user/register', obj)
      console.log(res.data);
      setToken(res.data.token);
      setUserId(res.data.id);
      toast.success(res.data.message);
      history.push('/home');
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }

  return (
    <>
      <Row>
        <header className="registerHeader" style={{ display: "flex", gap: 10, marginBottom: "3%", marginTop: "3%" }}>
          <TorneioIcon />
          <h2>Torne-<span style={{ color: "#E0E41A" }}>IO</span></h2>
        </header>
      </Row>
      <Row>
        <Col md={4} className={"content-left"}>
          <LoginSvg />
          <h2>Crie, gerencie, e participe de torneio de futebol com seus amigos!</h2>

        </Col>
        <Col md={{ span: 4, offset: 3 }} className="content-right">
          <Form method="submit" onSubmit={(e) => handlerSubmit(e)} style={{ marginTop: "10%", marginBottom: "5%" }}>
            <h3 style={{ marginBottom: "3%" }} >Crie sua conta de forma simples</h3>
            <Form.Group style={{ marginBottom: "1%" }}>
              <Form.Control
                type="name"
                placeholder="Nome completo"
                onChange={e => handlerName(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group style={{ marginBottom: "1%" }}>
              <Form.Control
                type="email"
                placeholder="E-mail"
                onChange={e => handlerEmail(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group style={{ marginBottom: "3%" }}>
              <Form.Control
                type="password"
                placeholder="Senha"
                onChange={e => handlerPassword(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group style={{ marginBottom: "3%" }}>
              <Form.Control
                type="password"
                placeholder="Confirme a senha"
                onChange={e => handlerConfirmPassword(e)}
              ></Form.Control>
            </Form.Group>
            <Button type="button" onClick={handlerSubmit} variant="primary">Criar conta</Button>
          </Form>
          <p className="divider">ou</p>
          <h3>Já tem uma conta?</h3>
          <Button type="button" variant="outline-primary" ><a href="/login" style={{textDecoration: "none", color: "inherit" }}>Faça login</a></Button>
        </Col>
      </Row>
    </>
  )
}