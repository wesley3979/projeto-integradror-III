'use strict';

module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    
      image: Sequelize.STRING,
        
    });

  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.dropTable('User');    
  }
};
