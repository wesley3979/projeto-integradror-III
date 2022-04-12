import React, { useEffect, useState } from 'react'
import { Col, Row, InputGroup, FormControl, Button, Modal, Form } from 'react-bootstrap'
import avatar from '../../assets/pic.png'
import { auth } from '../../services/auth'
import { api } from '../../services/api'
import { useUser } from '../../providers/userContext'
import './style.css'
import { toast } from 'react-toastify'
export const Home = () => {
  const { userId, setName, setEmail, setImage, token} = useUser();
  const [show, setShow] = useState(false);
  const [tournamentInCode, setTournamentInCode] = useState();
  const [teamCode, setTeamCode] = useState();
  const [teamName, setTeamName] = useState();
  const [description, setDescription] = useState();
  const [teams, setTeams] = useState();
  const [award, setAward] = useState();
  const [championship, setChampionship] = useState([])
  const [allUsers, setAllUsers] = useState([])

  const handlerTournamentInCode = ({target}) => {
    setTournamentInCode(target.value);
  }

  const handlerTeamCode = ({target}) => {
    setTeamCode(target.value);
  }

  const handlerTeamName = ({target}) => {
    setTeamName(target.value);
  }

  const handlerDescription = ({target}) => {
    setDescription(target.value);
  }

  const handlerTeams = ({target}) => {
    setTeams(target.value);
  }

  const handlerAward = ({target}) => {
    setAward(target.value);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const enterTeam = async () => {
    try{
      let res = await api.post(`/team/${teamCode}/championship/${tournamentInCode}/insert`)
      toast.success(res.message);
    }catch(e){
      toast.error(e.response.data.message);
    }
  }

  const registerTournament = async () => {
    let obj = {
      name: teamName,
      description,
      numberTeams: teams,
      award
    }
    try{
      let res = await api.post(`/championship/create`, obj, auth(token));
      toast.success(res.data.message);
      getTournaments();
      handleClose();
    }catch(e){
      toast.error(e.response.data.message);
    }
  }

  const getUserData = async () => {
    let res = await api.get(`/user/${userId}`, auth(token))
    
    setName(res.data.findUser.name);
    setEmail(res.data.findUser.email);
    setImage(res.data.findUser.image);
  }

  const getTournaments = async () => {
    let res = await api.get('/championship', auth(token));
    console.log(res.data.championship);
    setChampionship(res.data.championship);
  }

  const getAllUsers = async () => {
    let res = await api.get('/user', auth(token))
    console.log(res.data.allUsers)
    setAllUsers(res.data.allUsers)
  }

  useEffect(() => {
    getUserData();
    getAllUsers();
    getTournaments();
  },[userId])
  return (
    <>
      <Row>
        <Col md={2}>
          <h3>Torneios</h3>
        </Col>
        <Col md={7}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Col>
        <Col md={1}>
          <p>Ordenar</p>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleShow}>Criar Torneio</Button>
        </Col>
      </Row>
      {championship.map(championship => {
        return(
          <div className={"cardsContainer"} key={championship.championshipId}>
            <Row className={"toneioCard"}>
              <Col md={1}>
                <img src={avatar} width={50}/>
              </Col>
              <Col md={6}>
                <h2>{championship.name}</h2>
              </Col>
              <Col md={3}>Criado Por: {allUsers.filter(user => user.userId == championship.creatorUserId)[0].name}</Col>
              <Col md={2}>Status: {championship.status}</Col>
            </Row>
          </div>

        )
      })}

      <Modal show={show} onHide={handleClose} >
       
        <Modal.Body className={"modalNewTeam"}>
          <Form method="submit">
            <h3>Entrar em um Torneio</h3>
            <Row>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Código do torneio" 
                  onChange={ e => handlerTournamentInCode(e) }
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Código de time" 
                  onChange={ e => handlerTeamCode(e) }
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Col md={12}>
                <Button type={"button"} variant={"primary"} onClick={() => enterTeam()}>Entrar no Time</Button>
              </Col>
            </Row>
          </Form>
          <p>Ou</p>        
          <Form method="submit">
            <Row>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Nome do torneio" 
                  onChange={ e => handlerTeamName(e) }
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Descrição do torneio" 
                  onChange={ e => handlerDescription(e) }
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Control 
                  type="number" 
                  placeholder="Nº de times participantes" 
                  onChange={ e => handlerTeams(e) }
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Premiação" 
                  onChange={ e => handlerAward(e) }
                ></Form.Control>
              </Form.Group>
            </Row> 
            <Row>
              <Col md={12}>
                <Button type={"button"} variant={"primary"} onClick={() => registerTournament()}>Entrar no Time</Button>
              </Col>
            </Row>      

          </Form>
        </Modal.Body>
        
      </Modal>
    </>
  )
}