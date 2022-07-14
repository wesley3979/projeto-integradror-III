import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { useUser } from "../../providers/userContext"
import { useHistory } from "react-router-dom"
import { auth } from "../../services/auth";
import { api } from "../../services/api";
import { ReactComponent as SairIcon } from "../../assets/icon-sair.svg";
import { ReactComponent as EditIcon } from "../../assets/pencil.svg";
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
  Form
} from "react-bootstrap";
import "./style.css";

export const MyTournaments = () => {
  const [championships, setChampionships] = useState();
  const [registerName, setRegisterName] = useState();
  const [registerEmail, setRegisterEmail] = useState();
  const [password, setPassword] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const { setUserId, setToken } = useUser();
  const history = useHistory()

  const localToken = localStorage.getItem("token")
  const localUserId = localStorage.getItem("UserId")

  const getUserById = async () => {
    try {
      let res = await api.get(`/user/${localUserId}`, auth(localToken))
      setRegisterName(res.data.findUser.name);
      setRegisterEmail(res.data.findUser.email);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const getAllchampionship = async () => {
    let res = await api.get(`/championship/creatorUserId/${localUserId}`, auth(localToken));
    setChampionships(res.data.championship);
  }

  useEffect(() => {
    getUserById();
    getAllchampionship();
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
        {championships && championships.map(championship => {
          return (
            <div className={"cardsContainer"} key={championship.championshipId}>
              <Row className={"toneioCard"}>
                <Col md={10}>
                  <h2>{championship.name}</h2>
                </Col>
                <Col md={2}>
                  <Button variant="warning">
                    <a href={'/championship/EditTournament/' + championship.championshipId} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                      Editar torneio
                    </a>
                  </Button>

                </Col>
              </Row>
            </div>
          )
        })}
      </Row>
    </>
  );
};
