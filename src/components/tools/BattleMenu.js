import React, {useState} from 'react'
import {connect} from 'react-redux'

import { matchedMonsters, startAttack} from '../../ducks/reducers/monsterReducer';


function BattleMenu(props) {
  let [battleIndex, setIndex] = useState(0)


    return (
        <div>
            <button onClick={props.startAttack}>Attack</button>

        </div>
    )
}

const mapStateToProps = state => {
  return { mapR: state.mapReducer, monsterR: state.monsterReducer };
};

export default connect(
  mapStateToProps,
  {matchedMonsters, startAttack}
)(BattleMenu);