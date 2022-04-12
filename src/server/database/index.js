const { Sequelize } = require('sequelize')
const dbConfig = require('../config/dbConfig')

const connection = new Sequelize(dbConfig)

module.exports = connection