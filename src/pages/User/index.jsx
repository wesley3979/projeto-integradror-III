import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../providers/userContext'
import { useHistory } from 'react-router-dom'
import { auth } from '../../services/auth'
import { api } from '../../services/api'
import { ReactComponent as SairIcon } from '../../assets/icon-sair.svg'
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
} from 'react-bootstrap'
import './style.css'

export const User = () => {
  const [registerName, setRegisterName] = useState()
  const [registerEmail, setRegisterEmail] = useState()
  const [password, setPassword] = useState()
  const [oldPassword, setOldPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const { setUserId, setToken } = useUser()
  const history = useHistory()

  const localToken = localStorage.getItem('token')
  const localUserId = localStorage.getItem('UserId')
  var localChampionshipId = window.location.pathname.replace('/torneio/', '')

  const handlerEmail = ({ target }) => {
    let { value } = target
    setRegisterEmail(value)
  }
  const handlerName = ({ target }) => {
    let { value } = target
    setRegisterName(value)
  }

  const handlerOldPassword = ({ target }) => {
    let { value } = target
    setOldPassword(value)
  }

  const handlerPassword = ({ target }) => {
    let { value } = target
    setPassword(value)
  }

  const handlerConfirmPassword = ({ target }) => {
    let { value } = target
    setConfirmPassword(value)
  }

  const getUserById = async () => {
    try {
      let res = await api.get(`/user/${localUserId}`, auth(localToken))
      setRegisterName(res.data.findUser.name)
      setRegisterEmail(res.data.findUser.email)
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const handlerSubmit = async () => {
    const obj = {
      name: registerName,
      email: registerEmail,
      oldpassword: oldPassword,
      newpassword: password,
      confirmnewpassword: confirmPassword,
      image: null
    }
    try {
      let res = await api.patch(
        `/user/update/${localUserId}`,
        obj,
        auth(localToken)
      )
      setToken(res.data.token)
      setUserId(res.data.id)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('UserId', res.data.id)
      toast.success(res.data.message)
      history.push('/user')
    } catch (e) {
      toast.error(e.response.data.message)
    }
  }

  useEffect(() => {
    getUserById()
  }, [])

  return (
    <>
      <Row class="mt-2 mb-2 justify-content-center">
        <div className="boxContainer d-flex justify-content-center">
          <Form
            className="border p-5 rounded-3 mt-5"
            method="submit"
            onSubmit={e => handlerSubmit(e)}
            style={{ marginTop: '10%', marginBottom: '5%' }}
          >
            <h3 style={{ marginBottom: '3%' }}>
              Editar informações da sua conta
            </h3>
            <Form.Group className={'boxTextField'}>
              <Form.Control
                type="name"
                value={registerName}
                onChange={e => handlerName(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className={'boxTextField'}>
              <Form.Control
                type="email"
                value={registerEmail}
                onChange={e => handlerEmail(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className={'boxTextField'}>
              <Form.Control
                type="password"
                placeholder="Senha antiga"
                onChange={e => handlerOldPassword(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className={'boxTextField'}>
              <Form.Control
                type="password"
                placeholder="nova senha"
                onChange={e => handlerPassword(e)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className={'boxTextField'}>
              <Form.Control
                type="password"
                placeholder="Confirme a nova senha"
                onChange={e => handlerConfirmPassword(e)}
              ></Form.Control>
            </Form.Group>
            <Button
              type="button"
              onClick={handlerSubmit}
              variant="primary"
              className="buttonSaveChanges"
            >
              Salvar
            </Button>
          </Form>
        </div>
      </Row>
    </>
  )
}
