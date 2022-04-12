const Championship = require('../models/championshipModel')
const Team = require('../models/teamModel')
const Match = require('../models/matchModel')
const TeamChampionship = require('../models/teamChampionshipModel')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


class ChampionshipController {

  async createChampionship(req, res) {
    const { body } = req

    const status = 'Created'
    const {
      name,
      description,
      numberTeams,
      award
    } = body

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (!user)
      return res.status(422).json({ message: 'O token informado não corresponde a nenhum usuário.' })

    if (!name)
      return res.status(422).json({ message: 'O nome do torneio é obrigatório.' })

    if (!description)
      return res.status(422).json({ message: 'A descrição do torneio é obrigatória.' })

    if (!numberTeams)
      return res.status(422).json({ message: 'O número de times do torneio é obrigatório.' })

    if (numberTeams < 2)
      return res.status(422).json({ message: 'O número mínimo de times permitido no torneio é 2.' })

    if (!award)
      return res.status(422).json({ message: 'A premiação do torneio é obrigatória.' })

    const exists = await Championship.findAll({ where: { name } })

    if (exists) {
      for (var championshipObj in exists) {
        if (championshipObj.status != 'Concluded')
          return res.status(400).json({ message: 'Já existe um torneio ativo com esse nome' })
      }
    }

    const createdChampionship = await Championship.create({
      name,
      description,
      numberTeams,
      award,
      status: 'Created',
      creatorUserId: user.userId
    })

    return res.status(201).json({
      message: `Torneio criado com sucesso, compartilhe o código: ${createdChampionship.championshipId} com as equipes que deseja convidar para o torneio.`,
      createdChampionship
    })
  }

  async getInfosChampionshipById(req, res) {

    const { id } = req.params

    const championship = await Championship.findByPk(id)

    if (!championship) {
      return res.status(400).json({ message: 'Não existe um torneio correspondente ao Id informado' })
    }

    return res.status(200).json({ championship })

  }

  async getInfosAllChampionship(req, res) {

    try {

      const championship = await Championship.findAll()

      if (!championship) {
        return res.status(400).json({ message: 'Não há torneios cadastrados.' })
      }

      return res.status(200).json({ championship })

    } catch (err) {
      return res.status(500).json({ Message: 'Não foi possível buscar os torneios, tente novamente mais tarde' })
    }
  }

  async deleteChampionshipById(req, res) {

    const { id } = req.params

    try {
      const championship = await Championship.findByPk(id)
      if (championship.status == 'OpenSubscriptions' || championship.status == 'Started') {
        return res.status(400).json({ message: 'Não é permitido remover um torneio que está com Inscrições abertas ou em Andamento.' })
      }

      const token = getToken(req)
      const user = await getUserByToken(token)

      if (!user)
        return res.status(422).json({ message: 'O token informado não corresponde a nenhum usuário.' })

      if (user.userId != championship.creatorUserId)
        return res.status(422).json({ message: 'Somente o criador do torneio pode apagá-lo.' })

      const championshipDeletionStatus = await Championship.destroy({ where: { championshipId: id } })

      if (championshipDeletionStatus)
        return res.status(200).json({ message: 'Torneio removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar torneio.' })
    }
  }

  async getMatchesByChaphioshipId(req, res) {

    const { id } = req.params

    try {
      const championship = await Championship.findByPk(id)

      if (!championship) {
        return res.status(400).json({ message: 'Erro ao buscar partidas, pois o torneio informado não existe.' })
      }

      const matches = await Match.findAll({ where: { championshipId: id } })

      if (matches.length < 1) {
        return res.status(200).json({ message: 'As partidas referente a esse torneio ainda não foram geradas.' })
      }

      return res.status(200).json({ matches })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar partidas, tente novamente mais tarde.' })
    }
  }

  async updateMatch(req, res) {
    try {
      const { body } = req

      const { idchampionship, idmatch } = req.params

      const {
        status,
        goals1,
        goals2,
        offSide1,
        offSide2,
        fouls1,
        fouls2,
        ballPossession1,
        ballPossession2
      } = body

      const token = getToken(req)
      const user = await getUserByToken(token)

      if (!user)
        return res.status(422).json({ message: 'O token informado não corresponde a nenhum usuário.' })

      const IsAdmin = await Championship.findOne({ where: { championshipId: idchampionship, creatorUserId: user.userId } })

      // if (!IsAdmin) {
      //   return res.status(400).json({
      //     message: 'Erro ao editar partida, pois o torneio informado não existe ou o usuário não é administrador do torneio.'
      //   })
      // }

      const existsMatch = await Match.findByPk(idmatch)

      if (!existsMatch) {
        return res.status(400).json({
          message: 'Id da partida inválido.'
        })
      }

      if (existsMatch.status == 'Concluded') {
        return res.status(400).json({
          message: 'Impossível editar informações de uma partida que já foi concluída.'
        })
      }

      if (ballPossession1 + ballPossession2 != 100) {
        return res.status(400).json({
          message: 'Erro: a soma das posses de bola deve ser igual a 100.'
        })
      }

      if (existsMatch.status == 'Started' && status == 'Created') {
        return res.status(400).json({
          message: 'Erro: não é permitido reverter o status de uma partida que já foi iniciada para Criada.'
        })
      }

      var winner = null
      if (status == 'Concluded') {
        if (parseInt(goals1) > parseInt(goals2)) {
          winner = existsMatch.team1name
        }
        if (parseInt(goals2) > parseInt(goals1)) {
          winner = existsMatch.team2name
        }
      }

      const updatedMatch = await Match.update({
        status,
        goals1,
        goals2,
        offSide1,
        offSide2,
        fouls1,
        fouls2,
        ballPossession1,
        ballPossession2,
        winner
      }, { where: { matchId: idmatch } })

      if (updatedMatch) {
        const match = await Match.findByPk(idmatch)

        if (match.status == 'Concluded') {

          let team1 = await TeamChampionship.findOne({
            where: {
              teamId: match.team1Id,
              championshipId: idchampionship
            }
          })

          let team2 = await TeamChampionship.findOne({
            where: {
              teamId: match.team2Id,
              championshipId: idchampionship
            }
          })

          //aux update ranking
          if (winner == match.team1name) {
            team1.matchesPlayed++
            team1.matchesWon++
            team1.Points = team1.Points + 3

            team2.matchesPlayed++
            team2.matchesLost++
          }
          if (!winner) {
            team1.matchesPlayed++
            team1.matchesDrawn++
            team1.Points++

            team2.matchesPlayed++
            team2.matchesDrawn++
            team2.Points++
          }
          if (winner == match.team2name) {
            team1.matchesPlayed++
            team1.matchesLost++

            team2.matchesPlayed++
            team2.matchesWon++
            team2.Points = team2.Points + 3
          }

          await team1.save()
          await team2.save()
        }
        return res.status(200).json({ message: 'Partida atualizada com sucesso' })
      }
      else {
        return res.status(400).json({ message: 'Impossível atualizar partida com as informações fornecidas' })
      }

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao atualizar partida, tente novamente mais tarde.' })
    }
  }

  async updateChampionship(req, res) {
    const { body } = req

    const { id } = req.params

    const {
      name,
      description,
      numberTeams,
      award,
      status,
    } = body

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (!user)
      return res.status(422).json({ message: 'O token informado não corresponde a nenhum usuário.' })

    if (!name)
      return res.status(422).json({ message: 'O nome do torneio é obrigatório.' })

    if (!description)
      return res.status(422).json({ message: 'A descrição do torneio é obrigatória.' })

    if (!numberTeams)
      return res.status(422).json({ message: 'O número de times do torneio é obrigatório.' })

    if (numberTeams < 2)
      return res.status(422).json({ message: 'O número mínimo de times permitido no torneio é 2.' })

    if (!status)
      return res.status(422).json({ message: 'O novo status do torneio deve ser preenchido.' })

    if (!award)
      return res.status(422).json({ message: 'A premiação do torneio é obrigatória.' })

    try {
      const exists = await Championship.findAll({ where: { name } })

      if (exists) {
        for (var championshipObj in exists) {
          if (championshipObj.status != 'Concluded' && user.UserId != championshipObj.creatorUserId)
            return res.status(400).json({ message: 'Já existe um torneio ativo com esse nome' })

          if (user.UserId == championshipObj.creatorUserId) {
            if (championshipObj.status == 'Started')
              return res.status(422).json({ message: 'Não é possível editar o torneio após iniciá-lo.' })

            if (championshipObj.status == 'Concluded')
              return res.status(422).json({ message: 'Não é possível editar um torneio que já foi concluído.' })
          }
        }
      }

      const updatetorneio = await Championship.findByPk(id)
      await updatetorneio.update({
        name,
        description,
        numberTeams,
        award,
        status
      })

      return res.status(201).json({ message: 'Torneio atualizado com sucesso.' })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao atualizar torneio, tente novamente mais tarde.' })
    }

  }

  async startChampionship(req, res) {

    const { id } = req.params

    const token = getToken(req)
    const user = await getUserByToken(token)

    if (!user)
      return res.status(422).json({ message: 'O token informado não corresponde a nenhum usuário.' })

    const championship = await Championship.findByPk(id)

    if (!championship)
      return res.status(422).json({ message: 'O id informado não corresponde a nenhum torneio.' })

    if (championship.status == 'Started')
      return res.status(422).json({ message: 'Este torneio já foi iniciado anteriormente.' })

    if (championship.status == 'Concluded')
      return res.status(422).json({ message: 'Erro, pois este torneio já foi concluido.' })

    if (championship.creatorUserId != user.userId)
      return res.status(422).json({
        message: 'Você não tem autorização para iniciar este torneio, somente o criador do torneio pode iniciá-lo.'
      })

    const registeredTeams = await Championship.findByPk(id, {
      include: Team
    })

    if (championship.numberTeams != registeredTeams.Teams.length)
      return res.status(422).json({ message: 'Não há times suficientes para iniciar o torneio.' })


    const randomTeams = shuffleArray(registeredTeams.Teams)
    //generate matches
    for (let i = 0; i < randomTeams.length - 1; i++) {

      for (let j = i + 1; j < randomTeams.length; j++) {
        //create matches
        await Match.create({
          status: 'Created',
          team1name: randomTeams[i].name,
          team2name: randomTeams[j].name,
          team1Id: randomTeams[i].teamId,
          team2Id: randomTeams[j].teamId,
          goals1: 0,
          goals2: 0,
          offSide1: 0,
          offSide2: 0,
          fouls1: 0,
          fouls2: 0,
          ballPossession1: 50,
          ballPossession2: 50,
          winner: null,
          championshipId: championship.championshipId
        })

      }

    }

    championship.update({ status: 'Started' })

    return res.status(200).json({ message: 'O torneio foi iniciado com sucesso, verifique as partidas.' })

  }

  async getTableChampionshipId(req, res) {
    const { id } = req.params

    const exists = await Championship.findByPk(id)

    if (!exists)
      return res.status(422).json({ message: 'Erro, o torneio informado não existe.' })

    if (exists.status != 'Started' && exists.status != 'Concluded')
      return res.status(422).json({ message: 'Erro, este torneio ainda não foi iniciado.' })

    const table = await TeamChampionship.findAll({
      where: { championshipId: id },
      order: [
        ['Points', 'DESC'],
        ['matchesWon', 'DESC'],
      ],
    })

    return res.status(200).json({ table })
  }

}
module.exports = new ChampionshipController

// Function to randomize teams array
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}