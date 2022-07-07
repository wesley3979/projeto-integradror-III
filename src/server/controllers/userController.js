const { findByPk } = require('../models/userModel')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

class UserController {

  async createUser(req, res) {
    try {
      const { body } = req

      const {
        name,
        email,
        password,
        confirmpassword,
        image
      } = body

      if (!name) {
        res.status(422).json({ message: 'O nome é obrigatório' })
        return
      }

      if (!email) {
        res.status(422).json({ message: 'O email é obrigatório' })
        return
      }

      if (!password) {
        res.status(422).json({ message: 'A senha é obrigatória' })
        return
      }

      if (!confirmpassword) {
        res.status(422).json({ message: 'A confirmação de senha é obrigatória' })
        return
      }

      if (password !== confirmpassword) {
        res.status(422).json({ message: 'A senha e a confirmação de senha devem ser iguais.' })
        return
      }

      const exists = await User.findOne({ where: { email } })

      if (exists) {
        return res.status(422).json({ message: `Já existe um usuário cadastrado com o email: ${email}.` })
      }

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      const createdUser = await User.create({
        name,
        email,
        password: passwordHash,
        image
      })

      await createUserToken(createdUser, req, res)

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao criar usuário, tente novamente mais tarde.' })
    }
  }

  async login(req, res) {
    const { email, password } = req.body

    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório' })
      return
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória' })
      return
    }

    const userExists = await User.findOne({ where: { email } })

    if (!userExists) {
      res.status(422).json({ message: `Não existe um usuário cadastrado com o email: ${email}.` })
      return
    }

    const checkPassword = await bcrypt.compare(password, userExists.password)

    if (!checkPassword) {
      res.status(422).json({ message: 'Senha inválida!' })
      return
    }

    await createUserToken(userExists, req, res)

  }

  async checkUser(req, res) {
    let currentUser

    if (req.headers.authorization) {

      const token = getToken(req)
      const decoded = jwt.verify(token, "secret")

      currentUser = await User.findByPk(decoded.id)
      currentUser.password = undefined

    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
  }

  async updateUser(req, res) {
    const { body } = req
    const { id } = req.params
    const {
      name,
      email,
      oldpassword,
      newpassword,
      confirmnewpassword,
      image
    } = body

    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório' })
      return
    }

    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório' })
      return
    }

    if (!oldpassword) {
      res.status(422).json({ message: 'A senha antiga deve ser informada' })
      return
    }

    if (!newpassword) {
      res.status(422).json({ message: 'A nova senha é obrigatória' })
      return
    }

    if (!confirmnewpassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória' })
      return
    }

    if (newpassword !== confirmnewpassword) {
      res.status(422).json({ message: 'A nova senha e a confirmação de nova senha devem ser iguais.' })
      return
    }

    const token = getToken(req)
    const userUpdateExists = await getUserByToken(token)

    if (userUpdateExists) {
      if (userUpdateExists.userId != id) {
        return res.status(422).json({ message: `O token informado não corresponde ao Id dos parâmetros` })
      }

      const usersMailExists = await User.findAll({ where: { email } })
      for (var obj in usersMailExists) {
        if (obj.userId != userUpdateExists.UserId) {
          return res.status(422).json({ message: `Já existe um usuário cadastrado com o email: ${email}.` })
        }
      }

    }
    else {
      return res.status(400).json({ message: `O token ou Id do usuário informado é inválido` })
    }

    if (newpassword === confirmnewpassword && oldpassword != null) {

      const checkPassword = await bcrypt.compare(oldpassword, userUpdateExists.password)
      if (!checkPassword) {
        return res.status(400).json({ message: `A senha antiga está incorreta` })
      }

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(newpassword, salt)
      userUpdateExists.password = passwordHash
    }

    try {
      await userUpdateExists.update({
        name,
        email,
        password: userUpdateExists.password,
        image
      })

      await createUserToken(userUpdateExists, req, res)

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao atualizar usuário, tente novamente mais tarde.' })
    }

  }

  async getUserById(req, res) {
    const { id } = req.params
    const token = getToken(req)
    const validateTokenWithUserId = await getUserByToken(token)
    if (validateTokenWithUserId) {
      if (validateTokenWithUserId.userId != id) {
        return res.status(401).json({ message: `O token informado não corresponde ao Id dos parâmetros` })
      }
    }
    else return res.status(401).json({ message: `O token informado não corresponde a nenhum usuário` })

    let findUser = await User.findByPk(id)

    if (findUser) {
      findUser.password = undefined
      return res.status(200).json({ findUser })
    } else {
      return res.status(404).json({ message: 'usuário não encontrado' })
    }
  }

  async getAllUsers(req, res) {
    let allUsers = await User.findAll()
    allUsers.forEach(user => {
      user.password = undefined
    });

    return res.status(200).json({ allUsers })
  }

  async deleteUser(req, res) {

    const { id } = req.params
    const token = getToken(req)
    const validateTokenWithUserId = await getUserByToken(token)
    if (validateTokenWithUserId) {
      if (validateTokenWithUserId.userId != id) {
        return res.status(401).json({ message: `O token informado não corresponde ao Id dos parâmetros` })
      }
    }
    else return res.status(401).json({ message: `O token informado não corresponde a nenhum usuário` })

    try {


      const userDeletionStatus = await User.destroy({ where: { userId: id } })

      if (userDeletionStatus)
        return res.status(200).json({ message: 'Usuário removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar usuário.' })
    }
  }

  async getAllTeamsByUserId(req, res) {

    const { id } = req.params
    const token = getToken(req)
    const validateTokenWithUserId = await getUserByToken(token)
    if (validateTokenWithUserId) {
      if (validateTokenWithUserId.userId != id) {
        return res.status(401).json({ message: `O token informado não corresponde ao Id dos parâmetros` })
      }
    }
    else return res.status(401).json({ message: `O token informado não corresponde a nenhum usuário` })

    try {

      let result = await User.findByPk(id, {
        include: Team
      })
      if (result) result.password = undefined

      return res.status(200).json({ result })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar times, tente novamente mais tarde.' })
    }
  }

}
module.exports = new UserController