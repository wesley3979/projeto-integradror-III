const connection = require('../database')
const { Model, DataTypes } = require('sequelize')

const User = require('./userModel')
const TeamUser = require('./teamUserModel')

const Championship = require('./championshipModel')
const TeamChampionship = require('./teamChampionshipModel')

class Team extends Model { }
Team.init({
  teamId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  abbreviation: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  numberOfPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  creatorUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  image: DataTypes.STRING

},
  {
    sequelize: connection,
    modelName: 'Team',
    freezeTableName: true,
    timestamps: false,
  }
)

//RELACIONAMENTO N:N (User - Team)
Team.belongsToMany(User, {
  through: {
    model: TeamUser
  },
  foreignKey: 'teamId',
  constraint: true
})

User.belongsToMany(Team, {
  through: {
    model: TeamUser
  },
  foreignKey: 'userId',
  constraint: true
})

Team.hasMany(TeamUser, { foreignKey: 'teamId' })
TeamUser.belongsTo(Team, { foreignKey: 'teamId' })
User.hasMany(TeamUser, { foreignKey: 'userId' })
TeamUser.belongsTo(User, { foreignKey: 'userId' })

//RELACIONAMENTO N:N (Championship - Team)
Team.belongsToMany(Championship, {
  through: {
    model: TeamChampionship
  },
  foreignKey: 'teamId',
  constraint: true
})

Championship.belongsToMany(Team, {
  through: {
    model: TeamChampionship
  },
  foreignKey: 'championshipId',
  constraint: true,
  onDelete: 'cascade'
})

Team.hasMany(TeamChampionship, { foreignKey: 'teamId' })
TeamChampionship.belongsTo(Team, { foreignKey: 'teamId' })
Championship.hasMany(TeamChampionship, { foreignKey: 'championshipId' })
TeamChampionship.belongsTo(Championship, { foreignKey: 'championshipId' })

module.exports = Team

