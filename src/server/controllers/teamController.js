const { Op } = require("sequelize");
const Team = require('../models/teamModel')
const User = require('../models/userModel')
const Championship = require('../models/championshipModel')
const Match = require('../models/matchModel')
const TeamChampionship = require('../models/teamChampionshipModel')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token');

class TeamController {

  async createTeam(req, res) {
    try {

      const { body } = req
      const {
        name,
        abbreviation,
        numberOfPlayers,
        image
      } = body

      if (!name) {
        return res.status(400).json({ message: 'O nome do time não pode ser vazio.' })
      }

      if (!abbreviation) {
        return res.status(400).json({ message: 'Erro a abrevição do nome do time deve ter 3 ou 4 caracteres.' })
      }

      if (abbreviation.length < 3 || abbreviation.length > 4)
        return res.status(400).json({ message: 'Erro a abrevição do nome do time deve ter 3 ou 4 caracteres.' })

      if (!numberOfPlayers) {
        return res.status(400).json({ message: 'Erro o número de jogadores deve ser preenchido com o número inteiro' })
      }

      if (typeof numberOfPlayers !== 'number') {
        return res.status(400).json({ message: 'Erro o número de jogadores deve ser preenchido com o número inteiro' })
      }

      const token = getToken(req)
      const validateTokenWithUserId = await getUserByToken(token)

      if (!validateTokenWithUserId)
        return res.status(422).json({ message: `Token inválido.` })

      const teamByName = await Team.findOne({ where: { name } })
      if (teamByName) return res.status(422).json({ message: `Já existe um time cadastrado com este nome.` })

      const createdTeam = await Team.create({
        name,
        abbreviation,
        numberOfPlayers,
        creatorUserId: validateTokenWithUserId.userId,
        image
      })

      return res.status(201).json({ createdTeam })
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao criar time, tente novamente mais tarde.' })
    }
  }

  async updateTeam(req, res) {
    const { body } = req
    const { id } = req.params

    const {
      name,
      abbreviation,
      numberOfPlayers,
      image
    } = body

    if (!name) {
      return res.status(400).json({ message: 'O nome do time não pode ser vazio.' })
    }

    if (!abbreviation) {
      return res.status(400).json({ message: 'Erro a abrevição do nome do time deve ter 3 ou 4 caracteres.' })
    }

    if (abbreviation.length < 3 || abbreviation.length > 4)
      return res.status(400).json({ message: 'Erro a abrevição do nome do time deve ter 3 ou 4 caracteres.' })

    if (!numberOfPlayers) {
      return res.status(400).json({ message: 'Erro o número de jogadores deve ser preenchido com o número inteiro' })
    }

    if (typeof numberOfPlayers !== 'number') {
      return res.status(400).json({ message: 'Erro o número de jogadores deve ser preenchido com o número inteiro' })
    }

    const token = getToken(req)
    const validateTokenWithUserId = await getUserByToken(token)

    if (!validateTokenWithUserId)
      return res.status(422).json({ message: `Token inválido.` })

    const teamsByName = await Team.findAll({ where: { name } })

    let userHasAuth = false

    teamsByName.forEach(teamByName => {

      if (teamByName.teamId != id)
        return res.status(422).json({ message: `Já existe um time cadastrado com este nome.` })

      //verify user has authorization for update Team
      if (teamByName.creatorUserId == validateTokenWithUserId.userId)
        userHasAuth = true
    });

    //if (!userHasAuth) return res.status(422).json({ message: `Somente o criador da equipe pode atualiza-la.` })

    try {
      await Team.update({
        name,
        abbreviation,
        numberOfPlayers,
        image,
      }, {
        where: { teamId: id }
      })

      return res.status(200).json({ message: 'Time atualizado com sucesso.' })

    } catch (err) {
      return res.status(500).json({ message: 'Não foi possível atualizar o time, tente novamente mais tarde.' })
    }
  }

  async getTeamById(req, res) {
    const { id } = req.params

    const findTeam = await Team.findByPk(id)

    if (findTeam) {
      return res.status(200).json({ findTeam })
    } else {
      return res.status(404).json({ message: 'Erro ao buscar time, tente novamente mais tarde.' })
    }
  }

  async getAllTeams(req, res) {
    try {
      const allTeams = await Team.findAll()

      return res.status(200).json({ allTeams })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar times.' })
    }
  }

  async deleteTeam(req, res) {
    const { id } = req.params

    try {
      const teamDeletionStatus = await Team.destroy({ where: { teamId: id } })

      if (teamDeletionStatus)
        return res.status(200).json({ message: 'Time removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar time.' })
    }
  }

  async insertUserIntoTeam(req, res) {
    try {

      const { body } = req

      const {
        UserId,
        TeamId
      } = body

      const user = await User.findByPk(UserId)
      if (user) user.password = undefined

      if (!user) {
        return res.status(400).json({ message: 'Erro ao inserir jogador em equipe, pois o usuário informado não existe.' })
      }

      const team = await Team.findByPk(TeamId)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao inserir jogador em equipe, pois a equipe informada não existe.' })
      }

      const result = await user.addTeam([team])

      if (result)
        return res.status(201).json({ message: 'Usuário inserido no time', user, team })
      else
        return res.status(400).json({ message: 'Erro: o usuário informado já está cadastrado nessa equipe.', user, team })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao inserir jogador em equipe, tente novamente mais tarde.', err })
    }
  }

  async getAllUsersByTeamId(req, res) {
    try {
      const { id } = req.params

      let result = await Team.findByPk(id, {
        include: User
      })
      if (result) {
        result.Users.forEach(user => {
          user.password = undefined
        })
      }

      return res.status(200).json({ result })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao selecionar jogadores, tente novamente mais tarde.' })
    }
  }

  async RemoveUserFromTeam(req, res) {
    try {

      const { userid, teamid } = req.params

      const team = await Team.findByPk(teamid)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao remover jogador da equipe, pois a equipe informada não existe.' })
      }

      const token = getToken(req)
      const validateTokenWithUserId = await getUserByToken(token)

      if (validateTokenWithUserId) {
        if (validateTokenWithUserId.userId != userid && validateTokenWithUserId.userId != team.creatorUserId)
          return res.status(401).json({ message: `Você não tem autorização para remover este jogador da equipe` })
      }

      const user = await User.findByPk(userid)

      if (!user) {
        return res.status(400).json({ message: 'Erro ao remover jogador da equipe, pois o usuário informado não existe.' })
      }

      const result = await user.removeTeam(team)

      if (result)
        return res.status(201).json({ message: `'${user.name}' saiu da equipe '${team.name}'` })
      else
        return res.status(400).json({ message: `Não foi possível sair da equipe, pois '${user.name}' não é jogador to time '${team.name}'` })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao remover jogador da equipe,, tente novamente mais tarde.', err })
    }
  }

  async getChampionshipByTeamId(req, res) {
    try {
      const { id } = req.params

      const result = await Team.findByPk(id, {
        include: Championship
      })

      return res.status(200).json({ result })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar torneios, tente novamente mais tarde.', err })
    }
  }

  async getMatchesByTeamId(req, res) {
    try {
      const { id } = req.params

      const team = await Team.findByPk(id)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao buscar partidas, pois o time informado não existe.' })
      }

      const matches = await Match.findAll({
        where: {
          [Op.or]: [
            { team1Id: id },
            { team2Id: id },
          ]
        }
      })

      if (matches.length < 1) {
        return res.status(200).json({ message: 'Não há partidas para a equipe informada, entre em um torneio para poder ter partidas.' })
      }

      return res.status(200).json({ matches })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar partidas, tente novamente mais tarde.' })
    }
  }

  async insertTeamIntoChampionship(req, res) {
    try {

      const { body } = req
      const {
        idteam,
        idchampionship,
      } = body

      const token = getToken(req)
      const user = await getUserByToken(token)

      if (!user)
        return res.status(422).json({ message: `Token inválido.` })

      const team = await Team.findByPk(idteam)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao inserir equipe em torneio, pois o time informado não existe.' })
      }

      if (team.creatorUserId != user.userId) {
        return res.status(400).json({ message: 'Erro, somente o criador da equipe pode realizar a inscrição da equipe no torneio' })
      }

      const championship = await Championship.findByPk(idchampionship)

      if (!championship) {
        return res.status(400).json({ message: 'Erro ao inserir equipe em torneio, o torneio informado não existe.' })
      }

      const existsTeam = await TeamChampionship.findOne({ where: { teamId: team.teamId, championshipId: championship.championshipId } })

      if (existsTeam) {
        return res.status(400).json({
          message: 'Erro, pois está equipe já está inscrita nesse torneio'
        })
      }

      await TeamChampionship.create({
        "teamName": team.name,
        "matchesPlayed": 0,
        "matchesWon": 0,
        "matchesDrawn": 0,
        "matchesLost": 0,
        "Points": 0,
        "teamId": team.teamId,
        "championshipId": championship.championshipId
      })

      return res.status(200).json({ message: `${team.name} está participando do torneio: ${championship.name}` })


    } catch (err) {
      return res.status(500).json({ message: 'Erro ao inserir equipe em torneio, tente novamente mais tarde.' })
    }
  }

  async getTeamsByCreatorUserId(req, res) {
    try {
      const { id } = req.params

      const user = await User.findByPk(id)

      if (!user) {
        return res.status(400).json({ message: 'Erro, usuário inválido.' })
      }

      const teams = await Team.findAll({
        where: { creatorUserId: user.userId }
      })

      if (teams.length < 1) {
        return res.status(200).json({ message: 'Você ainda não criou nenhum time.' })
      }

      return res.status(200).json({ teams })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar partidas, tente novamente mais tarde.' })
    }
  }

}
module.exports = new TeamController