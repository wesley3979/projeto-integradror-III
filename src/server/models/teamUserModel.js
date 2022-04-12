const connection = require('../database')
const { Model, DataTypes } = require('sequelize')

class TeamUser extends Model { }
TeamUser.init({
  teamUserId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
},
  {
    sequelize: connection,
    modelName: 'TeamUser',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = TeamUser