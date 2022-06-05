import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login/index.jsx'
import { Register } from '../pages/Register/index.jsx'
import { Teams } from '../pages/Teams/index.jsx'

export const Pages = () => {
  return (
    <Router>
      <Switch >
        <Route path="/login" exact={true} component={Login} />
        <Route path="/register" exact={true} component={Register} />
        <Route path="/home" exact={true} component={Home} />
        <Route path="/teams" exact={true} component={Teams} />
        {/*<Route path="/list-torneios" exact={true}  component={ListTorneios} />            
        <Route path="/list-equipe" exact={true}  component={ListEquipe} />            
        <Route path="/perfil" exact={true}  component={Perfil} />            
        <Route path="/open-torneio/:id?" exact={true}  component={OpenTorneio} />             */}
      </Switch>
    </Router>
  )
}