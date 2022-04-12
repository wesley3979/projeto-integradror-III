const { Op } = require("sequelize");
const { findByPk } = require('../models/matchModel')
const Match = require('../models/matchModel')

class MatchController {

  async createMatch(req, res) {
    const { body } = req

    const status = 'Created'
    const {
      name,
      description,
      numberTeams,
      award,
      creatorUserId
    } = body

    const exists = await Championship.findAll({ where: { name } })

    if (exists) {
      for (var championshipObj in exists) {
        if (championshipObj.status != 'Concluded')
          return res.status(400).json({ message: 'Já existe um torneio ativo com esse nome' })
      }
    }

    const createdUser = await Championship.create({
      name,
      description,
      numberTeams,
      award,
      status,
      creatorUserId
    })

    return res.status(201).json({ message: 'Torneio criado com sucesso', createdUser })
  }

}
module.exports = new MatchController