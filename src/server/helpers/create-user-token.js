const jwt = require("jsonwebtoken")

const createUserToken = async (user, req, res) => {

  const token = jwt.sign({
    name: user.name,
    id: user.userId
  }, "secret")

  res.status(200).json({
    message: 'Usuário autenticado',
    token: token,
    id: user.userId
  })

}

module.exports = createUserToken;