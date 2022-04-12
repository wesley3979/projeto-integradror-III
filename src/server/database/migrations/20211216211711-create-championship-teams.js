'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('championshipTeams', {
      championshipTeamsId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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

      championshipId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'championship'
          },
          key: 'championshipId'
        },
        allowNull: false
      },

    });
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('championshipTeams');
    
  }
};
