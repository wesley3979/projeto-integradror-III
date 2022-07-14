import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login/index.jsx'
import { Register } from '../pages/Register/index.jsx'
import { Teams } from '../pages/Teams/index.jsx'
import { Torneio } from '../pages/Torneio/index.jsx'
import { User } from '../pages/User/index.jsx'
import { Team } from '../pages/Team/index.jsx'

export const Pages = () => {
  return (
    <Router>
      <Switch >
        <Route path="/" exact={true} component={Login} />
        <Route path="/login" exact={true} component={Login} />
        <Route path="/register" exact={true} component={Register} />
        <Route path="/home" exact={true} component={Home} />
        <Route path="/teams" exact={true} component={Teams} />
        <Route path="/team/:id?" exact={true} component={Team} />
        <Route path="/torneio/:id?" exact={true} component={Torneio} />
        <Route path="/user" exact={true} component={User} />
      </Switch>
    </Router>
  )
}