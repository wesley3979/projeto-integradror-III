const { Router } = require('express')
const routes = Router();
const teamController = require('../controllers/teamController');

const checkToken = require('../helpers/check-token') //middleware

routes.post('/create', checkToken, teamController.createTeam)
routes.post('/:id/update', checkToken, teamController.updateTeam)
routes.post('/user', checkToken, teamController.insertUserIntoTeam)
routes.get('/:id', checkToken, teamController.getTeamById)
routes.delete('/:teamid/user/:userid', checkToken, teamController.RemoveUserFromTeam)
routes.post('/:idteam/championship/:idchampionship/insert', checkToken, teamController.insertTeamIntoChampionship)
routes.delete('/delete/:id', checkToken, teamController.deleteTeam)
routes.get('/:id/users', checkToken, teamController.getAllUsersByTeamId)
routes.get('/:id/championship', checkToken, teamController.getChampionshipByTeamId)
routes.get('/:id/matches', checkToken, teamController.getMatchesByTeamId)
routes.get('/', checkToken, teamController.getAllTeams)


module.exports = routes