'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return queryInterface.createTable('match', { 
    idMatch:{      
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,   
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

    team1Id: {
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
    
    team2Id: {
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

    goals1: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    
    goals2: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
   
    offSide1: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    offSide2: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    fouls1: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    fouls2: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    
    ballPossession1: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    
    ballPossession2: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },

    winner: {
      type: Sequelize.ENUM,
      values: ['Time 1', 'Time 2'],
    }


  });

  },

  down: (queryInterface, Sequelize) => {
  return queryInterface.dropTable('match');
     
  }
};
