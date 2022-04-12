import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login/index.jsx'


export const Pages = () => {
  return(
    <Router>
      <Switch >
        <Route path="/" exact={true} component={Login} />
        <Route path="/home" exact={true} component={Home} />
        {/* <Route path="/cadastro" exact={true}  component={Cadastro} />            
        <Route path="/list-torneios" exact={true}  component={ListTorneios} />            
        <Route path="/list-equipe" exact={true}  component={ListEquipe} />            
        <Route path="/perfil" exact={true}  component={Perfil} />            
        <Route path="/open-torneio/:id?" exact={true}  component={OpenTorneio} />             */}
      </Switch>
    </Router>
  )
}