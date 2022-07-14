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
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [tournamentInCode, setTournamentInCode] = useState();
  const [teamCode, setTeamCode] = useState();
  const [teamName, setTeamName] = useState();
  const [description, setDescription] = useState();
  const [teams, setTeams] = useState();
  const [numberTeams, setNumberTeams] = useState();
  const [championship, setChampionship] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [oldFilterTeams, setOldFilterTeams] = useState([]);

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

  const handlerNumberTeams = ({ target }) => {
    setNumberTeams(target.value);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseNewTeam = () => setShowNewTeam(false);
  const handleShowNewTeam = () => setShowNewTeam(true);

  const enterTeam = async () => {
    try {
      let obj = {
        "UserId": localUserId,
        "TeamId": teamCode
      }

      let res = await api.post(`/team/user`, obj, auth(localToken))
      toast.success(res.data.message);
      handleClose();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }

  const registerTeam = async () => {
    let obj = {
      name: teamName,
      abbreviation: description,
      numberOfPlayers: parseInt(numberTeams),
    }
    try {
      let res = await api.post(`/team/create`, obj, auth(localToken));
      toast.success("Time criado com sucesso");
      getTournaments();
      handleCloseNewTeam();
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
    setOldFilterTeams(res.data.allTeams)
  }

  const getAllUsers = async () => {
    let res = await api.get('/user', auth(localToken))
    setAllUsers(res.data.allUsers);

  }

  const handleChangeInput = (event) => {
    const filter = oldFilterTeams.filter(
      x => x.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setTeams(filter);
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
              onChange={handleChangeInput}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleShowNewTeam}>Criar novo Time</Button>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleShow}>Entrar em Time</Button>
        </Col>
      </Row>
      {teams && teams.map(team => {
        return (
          <a
            href={"http://localhost:3000/team/" + team.teamId}
            style={{ textDecoration: "none", color: "white" }}
          >
            <div className={"cardsContainer"} key={team.teamId}>
              <Row className={"toneioCard"}>
                <Col md={7}>
                  <h2>{team.name}</h2>
                </Col>
                <Col md={2}>Criado por: {allUsers.filter(user => user.userId === team.creatorUserId)[0].name}</Col>
                <Col md={3}>Quantidade de jogadores: {team.numberOfPlayers}</Col>
              </Row>
            </div>
          </a>
        )
      })}

      <Modal className={"modalStyle"} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Entre em um time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Código do time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: 13254"
                autoFocus
                onChange={(e) => handlerTeamCode(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type={"button"}
            variant={"primary"}
            onClick={() => enterTeam()}
          >
            Solicitar participação
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className={"modalStyle"} show={showNewTeam} onHide={handleCloseNewTeam}>
        <Modal.Header closeButton>
          <Modal.Title>Criar novo time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome do time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Flamengo"
                onChange={e => handlerTeamName(e)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sigla do time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: FLA"
                onChange={e => handlerDescription(e)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nº de jogadores participantes</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                placeholder="Ex: 5"
                onChange={(e) => handlerNumberTeams(e)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type={"button"}
            variant={"primary"}
            onClick={() => registerTeam()}
          >
            Criar time
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}