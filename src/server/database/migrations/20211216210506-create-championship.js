'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {   
    return  queryInterface.createTable('championship', { 
      championshipId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      numberTeams: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      award: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM,
        values: ['Aguardando início', 'Em andamento', 'Concluído'],
        allowNull: false,
        defaultValue:'Aguardando início',
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
    });
     
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
     
  }
};
