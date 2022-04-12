const express = require('express')
const app = express()
const routes = require('./routes')
const cors = require('cors')

require('./database/db')

app.use(express.json())
app.use(cors({origin: '*'}));
routes(app)
app.listen(3007, () => {
  console.log('Rodando na porta: 3007');
})
