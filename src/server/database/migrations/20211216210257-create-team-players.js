'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teamPlayers', { 
      teamPlayersId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        references:{
          model: {
            tableName: 'user',
          },          
          key: 'userId',
        },
        allowNull: false
      },      

      teamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'team'
          },
          key: 'teamId'
        },
        allowNull: false
      },     
    });
    
  },

  down: (queryInterface, Sequelize) => {
  return queryInterface.dropTable('TeamPlayers');
    
  }
};
