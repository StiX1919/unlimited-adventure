import React, {Component} from 'react'

import CreateHero from '../components/heroCreation/CreateHero'
import App from '../App'

import {Switch, Route} from 'react-router-dom'



class MainRouter extends Component {
    

    render(){
        return (
            <Switch>
                <Route exact path='/' component={CreateHero}/>
                <Route path='/Map' component={App}/>
            </Switch>
        )
    }
}

export default MainRouter