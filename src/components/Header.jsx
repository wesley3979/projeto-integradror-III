import { useState } from "react"
import { Col, Row } from "react-bootstrap"
import { ReactComponent as TorneioIcon } from "../assets/torneioIcon.svg"
import { ReactComponent as UserDefaultIcon } from "../assets/user.svg"
import { ReactComponent as UserDefaultIcon2 } from "../assets/user-2.svg"
import { ReactComponent as Arrow } from "../assets/down-arrow.svg"
import { ReactComponent as TorneiosIcon } from "../assets/icon-torneios.svg"
import { ReactComponent as TimesIcon } from "../assets/icon-times.svg"
import { ReactComponent as SairIcon } from "../assets/icon-sair.svg"

import './css/Header.css'
import { useUser } from "../providers/userContext"
import { useHistory } from "react-router-dom"
export const Header = () => {
  const [visible, setVisible] = useState(false);
  const { name } = useUser();
  const history = useHistory()
  const handleVisible = () => {
    setVisible(!visible);
  }
  
  const redirectTournaments = () => {
    history.push('/home')
  }
 
  const redirectTeams = () => {
    history.push('/teams')
  }
  return (
    <header className="pageHeader">
      <Row>
        <Col md={{span: 2, offset: 1}}>
          <div style={{display: "flex", gap: 10, marginBottom: "10", marginTop: 40 }}>
            <TorneioIcon />
            <h2>Torne-<span style={{color: "#E0E41A"}}>IO</span></h2>
          </div>
        </Col>
        <Col md={{span: 2, offset: 10}} style={{display: "flex"}}>
          <div className={"icon"} onClick={() => handleVisible()}>
            <UserDefaultIcon />
            <Arrow className={"dropdownToggle"} />
          </div>
          {visible &&(
            <div className={"userDropdown"}>
              <div className={"userData"}>
                <Row>
                  <Col md={4}>
                    <div className={"dropDownIcon"}>
                      <UserDefaultIcon2 />
                    </div>
                  </Col>
                  <Col md={8}>
                      <h5>{name}</h5>
                      <p>Editar Conta</p>
                  </Col>
                </Row>
              </div>
              <hr />
              <div >
                <Row>
                  <Col style={{textAlign: "center"}} className={"menuItems"} onClick={()=> redirectTournaments()}>
                    <TorneiosIcon /> <b>Torneios</b>
                  </Col>
                </Row>
              </div>
              <hr />
              <div >
                <Row>
                  <Col style={{textAlign: "center"}} className={"menuItems"}>
                    <TimesIcon /> <b>Times</b>
                  </Col>
                </Row>
              </div>
              <hr />
              <div >
                <Row>
                  <Col style={{textAlign: "center"}} className={"menuItems"}>
                    <SairIcon /> <b>Sair</b>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </header>
  )
}