import React, {Component} from 'react'

import CreateHero from '../components/heroCreation/CreateHero'
import App from '../App'

import {Switch, Route} from 'react-router-dom'
import BlackSmith from '../components/blackSmith/blackSmith'



class MainRouter extends Component {
    

    render(){
        return (
            <Switch>
                <Route exact path='/' component={CreateHero}/>
                <Route path='/Map' component={App}/>
                <Route path='/blackSmith' component={BlackSmith} />
            </Switch>
        )
    }
}

export default MainRouter