import { useState } from "react";
import { Col, Row, Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import { ReactComponent as TorneioIcon } from "../assets/torneioIcon.svg";
import { ReactComponent as UserDefaultIcon } from "../assets/user.svg";
import { ReactComponent as UserDefaultIcon2 } from "../assets/user-2.svg";
import { ReactComponent as Arrow } from "../assets/down-arrow.svg";
import { ReactComponent as TorneiosIcon } from "../assets/icon-torneios.svg";
import { ReactComponent as TimesIcon } from "../assets/icon-times.svg";
import { ReactComponent as SairIcon } from "../assets/icon-sair.svg";

import "./css/Header.css";
import { useUser } from "../providers/userContext";
import { useHistory, Redirect } from "react-router-dom";
export const Header = () => {
  const [visible, setVisible] = useState(false);
  const { name } = useUser();
  const history = useHistory();
  const handleVisible = () => {
    setVisible(!visible);
  };

  const redirectTournaments = () => {
    return <Redirect to='/home' />
  };

  const redirectTeams = () => {
    return <Redirect to='/teams' />
  };

  const redirectLogin = () => {
    return <Redirect to='/login' />
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <header className="loginHeader" style={{ display: "flex", }}>
              <TorneioIcon />
              <h2>Torne-<span style={{ color: "#E0E41A" }}>IO</span></h2>
            </header></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Nav>
              <NavDropdown title="Opções" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/home">
                  Todos torneios
                </NavDropdown.Item>
                <NavDropdown.Item href="/teams">Todos times</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/myTournaments">
                  Meus torneios
                </NavDropdown.Item>
                <NavDropdown.Item href="/myTeams">
                  Meus times
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/user">Editar conta</NavDropdown.Item>
                <NavDropdown.Item href="/login">
                  Sair da conta
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
