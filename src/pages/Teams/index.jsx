import React, { useEffect, useState } from 'react'
import { Col, Row, InputGroup, FormControl, Button, Modal, Form } from 'react-bootstrap'
import avatar from '../../assets/pic.png'
import { auth } from '../../services/auth'
import { api } from '../../services/api'
import { useUser } from '../../providers/userContext'
import './style.css'
import { toast } from 'react-toastify'
// import { Header } from "../../components/Header"
export const Teams = () => {
  const { userId, setName, setEmail, setImage, token } = useUser();
  const [show, setShow] = useState(false);
  const [tournamentInCode, setTournamentInCode] = useState();
  const [teamCode, setTeamCode] = useState();
  const [teamName, setTeamName] = useState();
  const [description, setDescription] = useState();
  const [teams, setTeams] = useState();
  const [award, setAward] = useState();
  const [championship, setChampionship] = useState([])
  const [allUsers, setAllUsers] = useState([])

  const localToken = localStorage.getItem("token")
  const localUserId = localStorage.getItem("UserId")


  const handlerTournamentInCode = ({ target }) => {
    setTournamentInCode(target.value);
  }

  const handlerTeamCode = ({ target }) => {
    setTeamCode(target.value);
  }

  const handlerTeamName = ({ target }) => {
    setTeamName(target.value);
  }

  const handlerDescription = ({ target }) => {
    setDescription(target.value);
  }

  const handlerTeams = ({ target }) => {
    setTeams(target.value);
  }

  const handlerAward = ({ target }) => {
    setAward(target.value);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const enterTeam = async () => {
    try {
      let res = await api.post(`/team/${teamCode}/championship/${tournamentInCode}/insert`)
      toast.success(res.message);
    } catch (e) {
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
    try {
      let res = await api.post(`/championship/create`, obj, auth(localToken));
      toast.success(res.data.message);
      getTournaments();
      handleClose();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }

  const getUserData = async () => {
    let res = await api.get(`/user/${localUserId}`, auth(localToken))

    setName(res.data.findUser.name);
    setEmail(res.data.findUser.email);
    setImage(res.data.findUser.image);
  }

  const getTournaments = async () => {
    let res = await api.get('/championship', auth(localToken));
  }

  const getAllTeams = async () => {
    let res = await api.get('/team', auth(localToken));
    setTeams(res.data.allTeams);
  }

  const getAllUsers = async () => {
    let res = await api.get('/user', auth(localToken))
    setAllUsers(res.data.allUsers);

  }

  useEffect(() => {
    getUserData();
    getAllUsers();
    getTournaments();
    getAllTeams();
  }, [userId])

  return (
    <>
      <Row className="mt-4">
        <Col md={3}>
          <h3>Todos os times</h3>
        </Col>
        <Col md={5}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Pesquisar"
              aria-label="Pesquisar"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <p>Ordenar</p>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleShow}>Criar Time</Button>
        </Col>
      </Row>
      {teams && teams.map(team => {
        return (
          <div className={"cardsContainer"} key={team.teamId}>
            <Row className={"toneioCard"}>
              <Col md={1}>
                <img src={avatar} alt="logo do torneio" width={50} />
              </Col>
              <Col md={6}>
                <h2>{team.name}</h2>
              </Col>
              <Col md={2}>Criado por: {allUsers.filter(user => user.userId === team.creatorUserId)[0].name}</Col>
              <Col md={3}>Quantidade de jogadores: {team.numberOfPlayers}</Col>
            </Row>
          </div>

        )
      })}

      <Modal show={show} onHide={handleClose} >

        <Modal.Body className={"modalNewTeam"}>
          <Form method="submit">
            <h3>Entrar em um time</h3>
            <Row>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Código de time"
                  onChange={e => handlerTeamCode(e)}
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
                  placeholder="Nome do time"
                  onChange={e => handlerTeamName(e)}
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Sigla do time (Ex: FLA)"
                  onChange={e => handlerDescription(e)}
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Nº de jogadores participantes"
                  onChange={e => handlerTeams(e)}
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row>
              <Col md={12}>
                <Button type={"button"} variant={"primary"} onClick={() => registerTournament()}>Criar novo time</Button>
              </Col>
            </Row>

          </Form>
        </Modal.Body>

      </Modal>
    </>
  )
}