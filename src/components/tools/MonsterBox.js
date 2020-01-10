import React, {useState, useEffect, useRef} from 'react'
import {getMap, move, prepSurroundings} from '../../ducks/reducers/mapReducer'
import {attackMon, moveMonsters} from '../../ducks/reducers/monsterReducer'

import {connect} from 'react-redux'


function MonsterBox(props) {
    // let statsArr = Object.keys(props.monster.info.stats)

    // let stats = statsArr.map((stat, i) => {
    //     return (
    //         <div key={i} style={{display: 'flex'}}>
    //             <h3>{stat}: {props.monster.info.stats[stat]}</h3>
            
    //         </div>
    //     )
    // })
    function attacking(){
    // await props.matchedMonsters(, props.mapR.heroY);
        props.attackMon(props.index, {
            mapX: props.mapR.mapX,
            mapY: props.mapR.mapY,
            monsters: props.monsterR.monsters,
            entered: props.mapR.entered,
            combatMons: props.monsterR.combatMons,
            location: {X: props.mapR.heroX , Y: props.mapR.heroY}})
    }   

    return (
        <img style={props.monsterR.attacking ? {border: 'solid red 2px', height: '46px', width: '46px'} : null} 
            onClick={props.monsterR.attacking ? attacking: null}
            className='mon-pic' 
            src={props.monster.info.img_link} 
            alt='a monster'
        />
    );
}

const mapStateToProps = state => {
  return { mapR: state.mapReducer, monsterR: state.monsterReducer };
};

export default connect(mapStateToProps, {getMap, move, prepSurroundings, attackMon, moveMonsters})(MonsterBox);
