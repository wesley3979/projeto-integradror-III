import React, { useEffect, useState } from "react";
import { auth } from "../../services/auth";
import { api } from "../../services/api";
import { ReactComponent as SairIcon } from "../../assets/icon-sair.svg";
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
import "./style.css";

export const Torneio = () => {
  const [championship, setChampionship] = useState();
  const [ranking, setRanking] = useState();
  const [matches, setMatches] = useState();

  const localToken = localStorage.getItem("token")

  const GetInfosChampionshipById = async () => {
    let res = await api.get(`/championship/9`, auth(localToken));
    setChampionship(res.data.championship);
  };

  const GetTableByChampionshipId = async () => {
    let res = await api.get("/championship/3/table", auth(localToken));
    setRanking(res.data.table);
  };

  const GetMatchesByChaphioshipId = async () => {
    let res = await api.get("/championship/3/matches", auth(localToken));
    setMatches(res.data.matches);
  };

  useEffect(() => {
    GetInfosChampionshipById();
    GetMatchesByChaphioshipId();
    GetTableByChampionshipId();
  }, []);

  return (
    <>
      <Row className="mt-2 mb-2">
        <Col md={2}>
          <Button variant="primary">
            <a href="/home" style={{ textDecoration: "none", color: "inherit" }}>
              <SairIcon />
              Voltar
            </a>
          </Button>
        </Col>
      </Row>
      <Row>
        <Card bg={"secondary"} className="mb-2 text-center">
          <Card.Title>
            <h1>{championship && championship.name}</h1>
          </Card.Title>
          <Card.Subtitle className="mb-3">
            {championship && championship.description}
          </Card.Subtitle>
          <Card.Body style={{ borderStyle: "solid" }}>
            <Row>
              <Col>
                <Card.Text>
                  Quantidade de equipes participantes:
                  {championship && championship.numberTeams}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  Premiação: {championship && championship.award}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  Status: {championship && championship.status}
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
          <Tabs
            defaultActiveKey="ranking"
            id="uncontrolled-tab-example"
            className="mb-3 mt-3"
            justify
          >
            <Tab eventKey="ranking" title="CLASSIFICAÇÃO">
              <h1>CLASSIFICAÇÃO DO TORNEIO</h1>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Equipe</th>
                    <th>N° partidas</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>PONTOS</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking &&
                    ranking.map((team) => (
                      <tr key={team.teamChampionshipId}>
                        <td>{ranking.indexOf(team) + 1}</td>
                        <td>{team.teamName}</td>
                        <td>{team.matchesPlayed}</td>
                        <td>{team.matchesWon}</td>
                        <td>{team.matchesDrawn}</td>
                        <td>{team.matchesLost}</td>
                        <td>{team.Points}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="matches" title="PARTIDAS">
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
  );
};
