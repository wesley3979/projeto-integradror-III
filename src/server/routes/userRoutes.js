const { Router } = require('express')
const routes = Router();
const userController = require('../controllers/userController');

const checkToken = require('../helpers/check-token') //middleware

routes.post('/register', userController.createUser)
routes.post('/login', userController.login)
routes.post('/checkuser', checkToken, userController.checkUser)
routes.patch('/update/:id', checkToken, userController.updateUser)
routes.get('/:id', checkToken, userController.getUserById)
routes.delete("/delete/:id", checkToken, userController.deleteUser)
routes.get('/', checkToken, userController.getAllUsers)
routes.get('/:id/team', checkToken, userController.getAllTeamsByUserId)

module.exports = routes