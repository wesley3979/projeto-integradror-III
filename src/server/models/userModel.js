const connection = require('../database')
const { Model ,DataTypes} = require('sequelize')

class User extends Model {}
User.init({
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    image: DataTypes.STRING,
  }, 
  {
    sequelize: connection,
    modelName: 'User',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = User