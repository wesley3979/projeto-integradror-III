const user = require('./userRoutes')
const team = require('./teamRoutes')
const championship = require('./championshipRoutes')



const routes = (app) => {
  app.use('/user', user)
  app.use('/team', team)
  app.use('/championship', championship)
}
module.exports = routes;