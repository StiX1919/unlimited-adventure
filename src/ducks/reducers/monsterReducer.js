import axios from 'axios';

//Action Constants

const GET_MONSTER = 'GET_MONSTER';
const GET_MONSTERS = 'GET_MONSTERS';
const SET_MONSTER = 'SET_MONSTER';

const ATTACKING = 'ATTACKING';
const REMOVE_MON = 'REMOVE_MON';

const MOVE_MON = 'MOVE_MON';
const MATCHED_MON = 'MATCHED_MON'

const GET_REWARDS = 'GET_REWARDS'

const START_ATTACK = 'START_ATTACK'
const ATTACK_MON = 'ATTACK_MON'

//Initial State

const initialState = {
  // monster info
  monsterStatus: 'alive',
  currentMonster: [],
  monsters: [{
    index: 0,
    X: 3,
    Y: 4,
    info:{
      name: 'Goblin',
      description: 'Whatever',
      image: 'https://opengameart.org/sites/default/files/Goblin_idle.gif',
      stats: {
        power: 450,
        endurance: 500,
        speed: 550,
        intelligence: 400,
        wisdom: 350
      },
      level: 1,
      rarity: 10,
      attributes: {
        heat: -.1,
        cold: -.1,
        death: .1
      }
    }
  }],

  combatMons: [],
  newMonIndex: 9,

  rewards: {
    gold: 0,
    items: [],
    exp: 0
  },
  attacking: false
};

//Action Creators

export function attackMon(index) {
  return {
    type: ATTACK_MON,
    payload: index
  }
}

export function startAttack() {
  return {
    type: START_ATTACK,
  }
}


export function setMonster(mon) {
  return {
    type: SET_MONSTER,
    payload: mon
  };
}

export function getMonster(X, Y) {
  return {
    type: GET_MONSTER,
    payload: axios.get(`/api/getMonster/${X}/${Y}`).then(response => {
      let randomX = (Math.floor(Math.random() * -10 ) + 1) + (X * 10);
      let randomY = (Math.floor(Math.random() * -10 ) + 1) + (Y * 10);
      return { X: randomX, Y: randomY, monsterInfo: { ...response.data } }
    })
  };
}

export function attack(newMon) {
  return {
    type: ATTACKING,
    payload: newMon
  };
}

export function getMonsters(X, Y) {
  return {
    type: GET_MONSTERS,
    payload: axios.get(`/api/getMonsters/${X}/${Y}`).then(response => {
      let index = 0
      const areaMonsters = response.data.map(monster => {
        let randomX = (Math.floor(Math.random() * -10 ) + 1) + (X * 10);
        let randomY = (Math.floor(Math.random() * -10 ) + 1) + (Y * 10);
        index += 1
        return { index, X: randomX, Y: randomY, info: { ...monster } };
      });
      return areaMonsters;
    })
  };
}

export function removeMonster(id) {
  return {
    type: REMOVE_MON,
    payload: id
  };
}

export function moveMonsters(X, Y, mons, entered, combatMons, hero) {
  return async function(dispatch){

    
    let types = ['X', 'Y'];
    let directions = ['>', '<'];
    if(entered === true){
      X = 1
      Y = 1
    }
    const movedMons = []
    for(let i = 0; i < mons.length; i++){
      if(combatMons.find(mon => {
        return mon.index === mons[i].index
      })) {
        movedMons.push(mons[i])
      } else {
        let openSpaces = ['up', 'down', 'left', 'right']
        if(mons[i].X === X * 10) {
          openSpaces = openSpaces.filter((dir) => {
        return dir !== 'right'
      })
    }
    if(mons[i].X === X * 10 - 9){
      openSpaces = openSpaces.filter((dir) => {
        return dir !== 'left'
      })
    }
    if(mons[i].Y === Y * 10) {
      openSpaces = openSpaces.filter((dir) => {
        return dir !== 'up'
      })
    }
    if(mons[i].Y === Y * 10 - 9){
      openSpaces = openSpaces.filter((dir) => {
        return dir !== 'down'
      })
    }
    movedMons.map(mon => {
      if(mon.X === mons[i].X + 1 && mon.Y === mons[i].Y){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'right'
        })
      } 
      if(mon.X === mons[i].X && mon.Y === mons[i].Y + 1){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'up'
        })
      }
      if(mon.X === mons[i].X - 1 && mon.Y === mons[i].Y){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'left'
        })
      }
      if(mon.X === mons[i].X && mon.Y === mons[i].Y - 1){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'down'
        })
      }
    })
    combatMons.map(mon => {
      if(mon.X === mons[i].X + 1 && mon.Y === mons[i].Y){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'right'
        })
      } 
      if(mon.X === mons[i].X && mon.Y === mons[i].Y + 1){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'up'
        })
      }
      if(mon.X === mons[i].X - 1 && mon.Y === mons[i].Y){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'left'
        })
      }
      if(mon.X === mons[i].X && mon.Y === mons[i].Y - 1){
        openSpaces = openSpaces.filter((dir) => {
          return dir !== 'down'
        })
      }
    })
    if(!openSpaces[0]){
      movedMons.push(mons[i])
    } else {
      let ranDir = openSpaces[Math.floor(Math.random() * openSpaces.length)] 
      switch(ranDir){
        case 'up':
          movedMons.push({...mons[i], Y: mons[i].Y + 1});
          break;
          case 'down':
            movedMons.push({...mons[i], Y: mons[i].Y - 1})
            break;
            case 'left':
              movedMons.push({...mons[i], X: mons[i].X - 1})
              break;
              case 'right':
                movedMons.push({...mons[i], X: mons[i].X + 1})
                break;
                default:
                  movedMons.push(mons[i])
                  
                }
              }
            }
          }
          
          await dispatch({
            type: MOVE_MON,
            payload: movedMons
          });
          dispatch(matchedMonsters(hero.X, hero.Y))
        }
      }

export function matchedMonsters(X, Y){
    let xArea = [X - 1, X, X + 1]
    let yArea = [Y - 1, Y, Y + 1]

    return {
        type: MATCHED_MON,
        payload: {xArea, yArea}
    }
}


export function getRewards(monster, X, Y){
  let gold = (monster.gold + X + Y) * monster.level,
    items = [],
    exp = monster.exp_value * monster.level



  return {
    type: GET_REWARDS,
    payload: {gold, items, exp}
  }
}

//Reducer

export default function monsterReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MONSTER + '_PENDING':
      return Object.assign({}, state, {
        isLoading: true
      });
    case GET_MONSTER + '_FULFILLED':

      let index = state.newMonIndex + 1
      
      return Object.assign({}, state, {
        isLoading: false,
        monsters: [...state.monsters, {...action.payload, index}],
        newMonIndex: index
      });

    case ATTACKING:
      return {
        ...state,
        currentMonster: action.payload,
        monsterHP: action.payload.HP
      };

    case GET_MONSTERS + '_PENDING':
      return {
        ...state,
        isLoading: true
      };

    case GET_MONSTERS + '_FULFILLED':
      return {
        ...state,
        isLoading: false,
        monsters: action.payload
      };

    case SET_MONSTER:
      return {
        ...state,
        currentMonster: action.payload
      };

    case REMOVE_MON:
      let slicedMons = state.monsters.filter(monster => {
        return monster.index !== action.payload
          
      });

      return {
        ...state,
        monsters: slicedMons,
        currentMonster: null
      };

    case MOVE_MON:
        let newList = action.payload.map(monster => {
          let incMon = state.combatMons.find(mon => mon.index === monster.index)
          if(incMon){
            return incMon
          } else return monster
        })

      return {
        ...state,
        monsters: newList
      };

    case MATCHED_MON:
        const {xArea, yArea} = action.payload

        let combatMons = state.monsters.filter(mon => {
            return (xArea.includes(mon.X) && yArea.includes(mon.Y))
        })
      return {
          ...state,
          combatMons
      }

    case GET_REWARDS:
      let {gold, items, exp} = action.payload

      return {
        ...state,
        rewards: {
          ...state.rewards,
          gold,
          items,
          exp
        }
      }


    case START_ATTACK:
      return {
        ...state,
        attacking: true
      }

    case ATTACK_MON:
        let newMons = state.monsters.filter((mon, i) => {
          return mon.index !== action.payload
        })
        let newCombats = state.combatMons.filter((mon, i) => {
          return mon.index !== action.payload
        })

        return {
          ...state,
          attacking: false,
          monsters: newMons,
          combatMons: newCombats
        }
    default:
      return state;
  }
}
