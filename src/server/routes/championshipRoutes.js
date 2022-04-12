const { Router } = require('express')
const routes = Router();
const championshipController = require('../controllers/championshipController')

const checkToken = require('../helpers/check-token') //middleware

routes.get('/:id', checkToken, championshipController.getInfosChampionshipById)
routes.get('/:id/table', checkToken, championshipController.getTableChampionshipId)
routes.get('/:id/matches', checkToken, championshipController.getMatchesByChaphioshipId)
routes.post('/create', checkToken, championshipController.createChampionship)
routes.post('/:idchampionship/matches/:idmatch', checkToken, championshipController.updateMatch)
routes.post('/:id/update', checkToken, championshipController.updateChampionship)
routes.post('/:id/start', checkToken, championshipController.startChampionship)
routes.delete('/delete/:id', checkToken, championshipController.deleteChampionshipById)
routes.get('/', checkToken, championshipController.getInfosAllChampionship)

module.exports = routes