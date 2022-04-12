const connection = require('../database')
const { Model, DataTypes } = require('sequelize')
const User = require('./userModel')
const TeamUser = require('./teamUserModel')

class Championship extends Model { }
Championship.init({
  championshipId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  numberTeams: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  award: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM,
    values: ['Created', 'OpenSubscriptions', 'ClosedSubscriptions', 'Started', 'Concluded'],
    allowNull: false,
    defaultValue: 'Created',
  }
},
  {
    sequelize: connection,
    modelName: 'Championship',
    freezeTableName: true,
    timestamps: false,
  }
)

User.hasMany(Championship, {
  foreignKey: 'creatorUserId'
})

module.exports = Championship

