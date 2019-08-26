import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'

import MonsterBox from "./MonsterBox";
import BattleMenu from './BattleMenu'
import {updateBattleOrder} from '../../ducks/reducers/monsterReducer'

import './BattleSection.css'

function BattleSection(props) {
    let [currentAttacker, setAttacker] = useState({type: 'hero', index: 0, inBattle: false})

    useEffect(() => {
        props.updateBattleOrder(props.monsterR.combatMons, {stats: {agility: 550}})
        props.monsterR.combatMons.length ? setAttacker({...currentAttacker, inBattle: true}) : setAttacker({...currentAttacker, inBattle: false}) 
    },[props.monsterR.combatMons.length])
    useEffect(() => {
        console.log('in')
        let {battleOrder} = props.monsterR
        console.log('battleOrder', battleOrder)
        for(let i = currentAttacker.index; i < battleOrder.length; i++){
            console.log(battleOrder[i], 'current')
            if(battleOrder[i].info){
                setAttacker({...currentAttacker, type: 'mon', index: i})
            } else {
                setAttacker({...currentAttacker, type: 'hero', index: i})
                break;
            }
        }

    }, [currentAttacker.inBattle])

    console.log(currentAttacker)
    return (
        <div className="battle-section">
            <img
            className="battle-background"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9JWBpjG4gcU3cR-vX6fYCnV9vohh9CE_Qm7437xm_mjldsiN6"
            alt="battle-img"
            />
            <img className='man-pic' src="https://i.redd.it/txwro5tmnqx11.png" alt="spiderman"/>
            <div className='mon-section'>
                {props.monsterR.combatMons.map((mon, i) => {
                        return <MonsterBox key={i} index={mon.index} monster={mon}/>
                    })
                }
            
            </div>

            <BattleMenu />
            
        </div>
    )
}

const mapStateToProps = state => {
  return { mapR: state.mapReducer, monsterR: state.monsterReducer };
};

export default connect(
  mapStateToProps,
  {updateBattleOrder}
)(BattleSection);