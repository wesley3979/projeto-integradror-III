import React, { useEffect, useState } from 'react'
import { auth } from '../../services/auth'
import { api } from '../../services/api'
import { useUser } from '../../providers/userContext'
import { ReactComponent as SairIcon } from "../../assets/icon-sair.svg";
import './style.css'
import { toast } from 'react-toastify'
import {
  Col,
  Row,
  Tab,
  Tabs,
  Card,
  Table,
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

export const Team = () => {
  const [team, setTeam] = useState();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const localToken = localStorage.getItem("token")
  var localTeamId = window.location.pathname.replace("/team/", "");

  const GetTeamById = async () => {
    try {
      let res = await api.get(`/team/${localTeamId}`, auth(localToken));
      setTeam(res.data.findTeam);
    } catch (e) {
      toast.error(e.response.data.message);

      setTimeout(function () {
        window.history.back();
      }, 2500);

    }
  };

  const GetUsersByTeamId = async () => {
    try {
      let res = await api.get(`/team/${localTeamId}/users`, auth(localToken));
      setPlayers(res.data.result.Users);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const GetMatchesByTeamId = async () => {
    try {
      let res = await api.get(`/team/${localTeamId}/matches`, auth(localToken));
      setMatches(res.data.matches);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    GetTeamById();
    GetUsersByTeamId();
    GetMatchesByTeamId();
  }, []);

  return (
    <>
      <Row className="mt-2 mb-2">
        <Col md={2}>
          <Button variant="primary">
            <a href="/teams" style={{ textDecoration: "none", color: "inherit" }}>
              <SairIcon />
              Voltar
            </a>
          </Button>
        </Col>
      </Row>
      <Row>
        <Card bg={"secondary"} className="mb-2 text-center">
          <Card.Title>
            <h1>{team && team.name}</h1>
          </Card.Title>
          <Card.Body style={{ borderStyle: "solid" }}>
            <Row>
              <Col>
                <Card.Text>
                  Abreviação: {team && team.abbreviation}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  Número de jogadores: {team && team.numberOfPlayers}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  Criador da equipe: {team && team.creatorUserId}
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>

          <Tabs
            defaultActiveKey="players"
            id="uncontrolled-tab-example"
            className="mb-3 mt-3"
            justify
          >
            <Tab eventKey="players" title="JOGADORES">

              {players && players.map(player => {
                return (
                  <div className={"cardsContainer"} key={team.teamId}>
                    <Row className={"toneioCard"}>
                      <Col className="text-start" md={6}>
                        <h4>{player.name}</h4>
                      </Col>
                      <Col className="text-start" md={6}>
                        <h5>Email: {player.email}</h5>
                      </Col>
                    </Row>
                  </div>
                )
              })}

            </Tab>
            <Tab eventKey="historymatches" title="HISTÓRICO DE PARTIDAS">
              <h1 className="mb-2">PARTIDAS</h1>
              <Row>
                {matches &&
                  matches.map((match) => (
                    <Col md={3} key={match.matchId}>
                      <Card className="mb-3 px-2">
                        <Card.Body>
                          <Card.Title>
                            {match.team1name} X {match.team2name}
                          </Card.Title>
                        </Card.Body>
                        <ListGroup
                          className="list-group mb-2"
                          style={{ backgroundColor: "#4717F6" }}
                        >
                          <ListGroupItem>PLACAR:</ListGroupItem>
                          <ListGroupItem>
                            {match.goals1} X {match.goals2}
                          </ListGroupItem>
                        </ListGroup>
                        <ListGroup
                          className="list-group mb-2"
                          style={{ backgroundColor: "#4717F6" }}
                        >
                          <ListGroupItem>
                            VENCEDOR: {match.winner}
                          </ListGroupItem>
                        </ListGroup>

                        <ListGroup
                          className="list-group mb-2"
                          style={{ backgroundColor: "#4717F6" }}
                        >
                          <ListGroupItem>STATUS: {match.status}</ListGroupItem>
                        </ListGroup>

                        <DropdownButton
                          variant="outline-secondary"
                          title="Estatísticas"
                          id="input-group-dropdown-2"
                          align="end"
                          className="mb-2"
                        >
                          <Dropdown.Item href="#">
                            N° FALTAS: {match.fouls1} x {match.fouls2}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#">
                            POSSE DE BOLA: {match.ballPossession1}% x{" "}
                            {match.ballPossession2}%
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#">
                            N° IMPEDIMENTOS: {match.offSide1} x {match.offSide2}
                          </Dropdown.Item>
                        </DropdownButton>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Tab>
          </Tabs>
        </Card>
      </Row>
    </>
  )
}