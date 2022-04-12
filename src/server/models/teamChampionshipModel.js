const connection = require('../database')
const { Model, DataTypes } = require('sequelize')

class TeamChampionship extends Model { }
TeamChampionship.init({
  teamChampionshipId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  matchesPlayed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  matchesWon: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  matchesDrawn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  matchesLost: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  Points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},

  {
    sequelize: connection,
    modelName: 'TeamChampionship',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = TeamChampionship

