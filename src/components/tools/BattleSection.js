import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'

import MonsterBox from "./MonsterBox";
import BattleMenu from './BattleMenu'
import {updateBattleOrder} from '../../ducks/reducers/monsterReducer'
import {useInterval} from '../../hooks/useInterval'

import './BattleSection.css'

function BattleSection(props) {
    let img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9JWBpjG4gcU3cR-vX6fYCnV9vohh9CE_Qm7437xm_mjldsiN6'
    let [currentAttacker, setAttacker] = useState({type: 'hero', index: 0, inBattle: false})
    let [ind, setInd] = useState(0)
    if(ind !== 0 && !props.monsterR.battleOrder[ind] && !props.monsterR.battleOrder[1]){
        setInd(0)
        // let newInd = props.monsterR.battleOrder.findIndex((e) => {
        //     if (e.luck){
        //         return true
        //     }
        // })
        // console.log(newInd)
        // setInd(newInd)
    }

    useEffect(() => {
        props.updateBattleOrder(props.monsterR.combatMons, props.heroR.hero)
        props.monsterR.combatMons.length ? setAttacker({...currentAttacker, inBattle: true}) : setAttacker({...currentAttacker, inBattle: false}) 
    },[props.monsterR.combatMons.length])


    useInterval(() => {
        let {battleOrder} = props.monsterR
        console.log('attacking hero', battleOrder[ind])
        setInd(ind < battleOrder.length ? ++ind : 0)
        setAttacker(battleOrder[ind + 1] ? battleOrder[ind + 1]: battleOrder[0])
    }, !props.monsterR.battleOrder[1] || props.monsterR.battleOrder[ind].luck ? null: 1000)
    // console.log(props.heroR)
    // useEffect(() => {
    //     let {battleOrder} = props.monsterR
    //     console.log('battleOrder', battleOrder)
    //     for(let i = currentAttacker.index; i < battleOrder.length; i++){
    //         if(battleOrder[i].info){
    //             setAttacker({...currentAttacker, type: 'mon', index: i})
    //         } else {
    //             setAttacker({...currentAttacker, type: 'hero', index: i})
    //             break;
    //         }
    //     }

    // }, [currentAttacker.inBattle])
    // setInterval(() => {
    //     setAttacker({...currentAttacker, index: currentAttacker.index + 1})
    //     console.log(currentAttacker.index)
    // }, 1000)
    // console.log(ind)
    return (
        <div className="battle-section">
            <img className="battle-background" src={img} alt="battle-img" />
            <img className='man-pic' src="https://i.redd.it/txwro5tmnqx11.png" alt="spiderman"/>
            <div className='mon-section'>
                {props.monsterR.combatMons.map((mon, i) => {
                        console.log(ind, i)
                        return <MonsterBox 
                                active={mon.index===props.monsterR.battleOrder[ind].index} 
                                key={i} 
                                index={mon.index} 
                                monster={mon}
                                setInd={setInd} 
                                ind={ind}/>
                    })
                }
            </div>
            <BattleMenu/>
        </div>
    )
}

const mapStateToProps = state => {
  return { mapR: state.mapReducer, monsterR: state.monsterReducer, heroR: state.heroReducer };
};

export default connect(
  mapStateToProps,
  {updateBattleOrder}
)(BattleSection);