import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { ReactComponent as LoginSvg } from "../../assets/loginIcon.svg"
import { ReactComponent as TorneioIcon } from "../../assets/torneioIcon.svg"
import { api } from "../../services/api"
import { useUser } from "../../providers/userContext"
import "./style.css"
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"

export const Login = () =>{
  const [loginEmail, setLoginEmail] = useState();
  const [password, setPassword] = useState();
  const { setUserId, setToken } = useUser();
  const history = useHistory()
  const handlerEmail = ({target}) => {
    let { value } = target
    setLoginEmail(value);
  }

  const handlerPassword = ({target}) => {
    let { value } = target
    setPassword(value);
  }

  const handlerSubmit = async () => {
    const obj = {
      email: loginEmail,
      password
    }
    try{
      let res = await api.post('/user/login', obj)
      console.log(res.data);
      setToken(res.data.token);
      setUserId(res.data.id);
      toast.success(res.data.message);
      history.push('/home');
    }catch(e) {
      toast.error(e.response.data.message);
    }
  }
  
  return (
      <>
        <Row>
          <header className="loginHeader" style={{display: "flex", gap: 10, marginBottom: "10%"}}>
            <TorneioIcon />
            <h2>Torne-<span style={{color: "#E0E41A"}}>IO</span></h2>
          </header>
        </Row>
        <Row>
          <Col md={5} className={"content-left"}>
            <LoginSvg />
            <h2>Crie, gerencie, e participe de torneio de futebol com seus amigos!</h2>

          </Col>
          <Col md={{span: 4, offset: 3}}  className="content-right">
            <Form method="submit" onSubmit={ (e) => handlerSubmit(e)}>
              <h3>Faça login para continuar</h3>
              <Form.Group>
                <Form.Control 
                  type="email" 
                  placeholder="E-mail" 
                  onChange={ e => handlerEmail(e) }
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Control 
                  type="password" 
                  placeholder="Senha" 
                  onChange={e => handlerPassword(e)}
                ></Form.Control>
              </Form.Group>
              <Button type="button" onClick={handlerSubmit} variant="primary">Fazer Login</Button>
            </Form>
            <p className="divider">ou</p>
            <h3>Crie sua própria conta, de forma fácil</h3>
            <Button type="button" variant="outline-primary" >Criar conta</Button>
          </Col>
        </Row>        
      </>
  )
}