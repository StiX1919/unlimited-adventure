import React, {useState, useEffect, useRef} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import {updateStats, resetStat, conversion, updateName} from '../../ducks/reducers/heroReducer'

import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import './createHero.css'


function App(props) {
    let [state, setState] = useState({
        name: '',
        age: 0,
    })
    let [stats, setStats] = useState(35)

    let statsArr = Object.keys(props.hero.stats)
    statsArr.pop()
    let statsEntries = statsArr.map((stat,i ) => {
        return (
            <div style={{display: 'flex'}}>
                <h4>{stat}: {Math.floor(props.hero.stats[stat])}</h4>

                <div>
                    <button onClick={() => props.bonusStats ? props.updateStats(stat) : null}>+</button>
                    <button onClick={() => props.resetStat(stat)}>Reset</button>
                </div>
            </div>
        )
    })
    let handleSubmit = () => {
        props.conversion(state.age, state.name, props.hero.name, props.hero.luck)
    }
    

    return (
        <div>
            <div className='info'>
                <h1>Account Info</h1>
                <h2>Real Name: {state.name}</h2>
                <input value={state.name} placeholder='enter name' onChange={(e) => setState({...state, name: e.target.value})}/>
                <h2>Age: {state.age}</h2>
                <input type='date' onChange={(e) => setState({...state, age: e.target.value})}/>
            </div>
            <h3>Hero Name: {props.hero.name}</h3>
                <input value={props.hero.name} placeholder='enter name' onChange={(e) => props.updateName(e.target.value)}/>
            <h3>Stat Points: {props.bonusStats}</h3>
            <div className='stats'>
                {statsEntries}
                <div>
                    <h3>HP: {Math.floor(props.hero.stats.power + props.hero.stats.endurance + props.hero.luck)}</h3>
                    <h3>MP: {Math.floor((props.hero.luck / 500) * (props.hero.stats.wisdom + props.hero.stats.intelligence))}</h3>
                    <h3>SP: {Math.floor((props.hero.stats.agility + props.hero.stats.endurance) * (props.hero.luck / 500))}</h3>
                </div>
            </div>
            <Link to='/Map'>
                <button disabled={!props.bonusStats && state.age && state.name ? false : true} onClick={handleSubmit}>Submit Hero</button>
            </Link>

        </div>
    );
}

const mapStateToProps = state => state.heroReducer

export default connect(mapStateToProps, {updateStats, resetStat, conversion, updateName})(App);
