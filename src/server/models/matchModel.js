const connection = require('../database')
const { Model, DataTypes } = require('sequelize')
const Championship = require('./championshipModel')

class Match extends Model { }
Match.init({
  matchId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['Created', 'Started', 'Concluded'],
    allowNull: false,
    defaultValue: 'Created',
  },

  team1name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  team2name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  team1Id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  team2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  goals1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  goals2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  offSide1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  offSide2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  fouls1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  fouls2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  ballPossession1: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0
  },

  ballPossession2: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0
  },

  winner: {
    type: DataTypes.STRING,
    allowNull: true,
  }
},
  {
    sequelize: connection,
    modelName: 'Match',
    freezeTableName: true,
    timestamps: false,
  }
)

Championship.hasMany(Match, { foreignKey: 'championshipId', onDelete: 'cascade' })

module.exports = Match