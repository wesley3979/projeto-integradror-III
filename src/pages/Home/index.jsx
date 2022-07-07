import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  InputGroup,
  FormControl,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import avatar from "../../assets/pic.png";
import { auth } from "../../services/auth";
import { api } from "../../services/api";
import { useUser } from "../../providers/userContext";
import "./style.css";
import { toast } from "react-toastify";
// import { Header } from "../../components/Header"
export const Home = () => {
  const { userId, setName, setEmail, setImage, token } = useUser();
  const [show, setShow] = useState(false);
  const [showModalNewTournament, setShowModalNewTournament] = useState(false);
  const [tournamentInCode, setTournamentInCode] = useState();
  const [teamCode, setTeamCode] = useState();
  const [teamName, setTeamName] = useState();
  const [description, setDescription] = useState();
  const [teams, setTeams] = useState();
  const [award, setAward] = useState();
  const [championship, setChampionship] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const localToken = localStorage.getItem("token")
  const handlerTournamentInCode = ({ target }) => {
    setTournamentInCode(target.value);
  };

  const handlerTeamCode = ({ target }) => {
    setTeamCode(target.value);
  };

  const handlerTeamName = ({ target }) => {
    setTeamName(target.value);
  };

  const handlerDescription = ({ target }) => {
    setDescription(target.value);
  };

  const handlerTeams = ({ target }) => {
    setTeams(target.value);
  };

  const handlerAward = ({ target }) => {
    setAward(target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleModalNewTournamentClose = () => setShowModalNewTournament(false);
  const handleModalNewTournamentShow = () => setShowModalNewTournament(true);

  const enterTeam = async () => {
    try {
      console.log(auth(localToken))
      let obj = {
        idteam: teamCode,
        idchampionship: tournamentInCode
      };
      let res = await api.post(`/team/championship/insert`, obj, auth(localToken));

      toast.success(res.message);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const registerTournament = async () => {
    let obj = {
      name: teamName,
      description,
      numberTeams: teams,
      award,
    };
    try {
      let res = await api.post(`/championship/create`, obj, auth(localToken));
      toast.success(res.data.message);
      getTournaments();
      handleClose();
      handleModalNewTournamentClose();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const getUserData = async () => {
    let res = await api.get(`/user/${userId}`, auth(localToken));

    setName(res.data.findUser.name);
    setEmail(res.data.findUser.email);
    setImage(res.data.findUser.image);
  };

  const getTournaments = async () => {
    let res = await api.get("/championship", auth(localToken));
    setChampionship(res.data.championship);
  };

  const getAllUsers = async () => {
    let res = await api.get("/user", auth(localToken));
    setAllUsers(res.data.allUsers);
  };

  useEffect(() => {
    getUserData();
    getAllUsers();
    getTournaments();
  }, [userId]);

  return (
    <>
      <Row className="mt-5">
        <Col md={2}>
          <h3>Torneios</h3>
        </Col>
        <Col md={6}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Pesquisar"
              aria-label="Pesquisar"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleModalNewTournamentShow}>
            Criar torneio
          </Button>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleShow}>
            Entrar em Torneio
          </Button>
        </Col>
      </Row>
      {championship.map((championship) => {
        return (
          <div className={"cardsContainer"} key={championship.championshipId}>
            <a
              href={"http://localhost:3000/torneio/" + championship.championshipId}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Row className={"toneioCard"}>
                <Col md={7}>
                  <h2>{championship.name}</h2>
                </Col>
                <Col md={3}>
                  Criado Por:{" "}
                  {
                    allUsers.filter(
                      (user) => user.userId === championship.creatorUserId
                    )[0].name
                  }
                </Col>
                <Col md={2}>Status: {championship.status}</Col>
              </Row>
            </a>
          </div>
        );
      })}

      <Modal className={"modalStyle"} show={showModalNewTournament} onHide={handleModalNewTournamentClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crie seu próprio torneio:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome do torneio</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder="Ex: Time Amigos..."
                onChange={(e) => handlerTeamName(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição do torneio</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder="Ex: Equipe do bairro X"
                onChange={(e) => handlerDescription(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nº de times participantes</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                placeholder="Nº de times participantes"
                onChange={(e) => handlerTeams(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Premiação</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder="Ex: R$XX,XX "
                onChange={(e) => handlerAward(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button type={"button"}
            variant={"primary"}
            onClick={() => registerTournament()}
          >
            Criar torneio
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className={"modalStyle"} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Entre em um torneio já existente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Código do torneio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: 12343"
                autoFocus
                onChange={(e) => handlerTournamentInCode(e)}
              />
            </Form.Group>
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
          <Button variant="secondary" onClick={handleModalNewTournamentClose}>
            Fechar
          </Button>
          <Button type={"button"}
            variant={"primary"}
            onClick={() => enterTeam()}
          >
            Solicitar participação
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
