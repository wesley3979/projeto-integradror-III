'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return queryInterface.createTable('team', { 
    teamId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    abbreviation:{
      type: Sequelize.STRING(4),
      allowNull: false,
    },

    creatorUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'user'
        },
        key: 'userId'
      },
      allowNull: false
    },      

    numberOfPlayers:{
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    image: Sequelize.STRING
      
  });
     
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('team');
     
  }
};
