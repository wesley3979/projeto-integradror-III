(async () => {
  const connection = require('./index')
  const User = require('../models/userModel')
  const Team = require('../models/teamModel')
  const TeamUser = require('../models/teamUserModel')
  const Championship = require('../models/championshipModel')
  const Match = require('../models/matchModel')

  await connection.sync()
})()