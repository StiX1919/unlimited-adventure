import axios from "axios";

// import { getMonsters } from './monsterReducer'


//Action Constants

const GET_MAP = "GET_MAP"
const UPDATE_AREA = 'UPDATE_AREA'

const MOVE = "MOVE"
const GO_BACK = 'GO_BACK'

const ENTER_AREA = 'ENTER_AREA'
const RETREAT = 'RETREAT'

const PREP_SURR = 'PREP_SURR'


//Initial State

const initialState = {
    areaMap: [],
    locations: [],

    mapX: 1,
    mapY: 1,
    mapPrevX: 1,
    mapPrevY: 1,

    heroX: 3,
    heroY: 3,
    heroPrevX: 3,
    heroPrevY: 3,

    retreatX: 3,
    retreatY: 3,

    clearLocX: null,
    clearLocY: null,
    
    activeSpot: {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'},
    entered: false,
    isLoading: false,

    moveCounter: 0,
    surroundings: {}
}


//Action Creators
export function retreat(){
    return {
        type: RETREAT,
        payload: false
    }

}

export function enterArea(X, Y, spotType){
    return function(dispatch)   {

        let numArr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        let locations = []
        
        function colorGen(place) {
            switch(place){
                case 'Town': 
                    return '#808080';
                case 'Plains': 
                    return '#90ee90';
                case 'Forest': 
                    return '#006400';
                case 'Ocean':
                    return '#00008b'
                case 'River':
                    return '#add8e6'
                case 'Mountains':
                    return '#803605'
                case 'Desert':
                    return '#f2a23a'
                default: return 'white'
            }
        }


        let areaMap = numArr.map( col => {
            let newRow = numArr.map( row => {
                locations.push({
                    x_location: row,
                    y_location: col,
                    area_type: spotType,
                    area_name: 'none',
                    discovered_by: 'none',
                    color: colorGen(spotType)
                })
                return {
                    x: row,
                    y: col,
                    type: spotType,
                    name: 'none',
                    discovered_by: 'none',
                    color: colorGen(spotType)
                }
            }).reverse()
            return newRow
        })
        // dispatch(getMonsters(1, 1))
        dispatch({
            type: ENTER_AREA,
            payload: {areaMap, locations, entered: true, X, Y}
        })
    }
}

export function goBack(X, Y, oldX, oldY){
    return function(dispatch){
        if(X !== oldX || Y !== oldY){
            dispatch(getMap(oldX, oldY))
            // dispatch(getMonsters(oldX, oldY))
        }

        dispatch({
            type: GO_BACK,
            payload: {X, Y}
        })
    }
}

export function move(direction, state){
    return function(dispatch){

        let letter = ''
        let type = 0
        let mod = 0
        let area = 0
        let oldArea = 1

        let dumbX = state.mapX
        let dumbY = state.mapY
        let newMap = state.areaMap
        
        if(direction === 'up' || direction === 'down'){
            type = state.heroY
            letter = 'Y'
            
            switch(direction){
                case 'up':
                if(state.heroY >= state.mapY * 10){
                    oldArea = state.mapY
                    area = state.mapY
                    if(state.entered === false){
                        area = ++dumbY
                        newMap = state.surroundings.up.areaMap.slice()
                        dispatch(prepSurroundings(state.mapX, area))
                        // dispatch(getMap(state.mapX, area))
                        // dispatch(getMonsters(state.mapX, state.mapY))
                    }
                } else {
                    area = state.mapY
                    oldArea = state.mapY
                }
                break;
                case 'down':
                if(state.heroY - 1 < ((state.mapY - 1) * 10) + 1){
                    oldArea = state.mapY
                    area = state.mapY
                    if(state.entered === false){
                        area = --dumbY
                        newMap = state.surroundings.down.areaMap.slice()
                        dispatch(prepSurroundings(state.mapX, area))
                        // dispatch(getMonsters(state.mapX, state.mapY))
                    }
                } else {
                    area = state.mapY
                    oldArea = state.mapY
                }
                break;
                default: area = state.mapY
            }
        } else if(direction === 'left' || direction === 'right'){
            type = state.heroX
            letter = 'X'
            switch(direction){
                case 'right':
                if(state.heroX >= (state.mapX * 10)){
                    oldArea = state.mapX
                    area = state.mapX
                    if(state.entered === false){
                        area = ++dumbX
                        newMap = state.surroundings.right.areaMap.slice()
                        dispatch(prepSurroundings(area, state.mapY))
                        // dispatch(getMap(area, state.mapY))
                        // dispatch(getMonsters(state.mapX, state.mapY))
                    }
                } else {
                    area = state.mapX
                    oldArea = state.mapX
                }
                break;
                case 'left':
                if(state.heroX - 1 < ((state.mapX - 1) * 10) + 1){
                    oldArea = state.mapX
                    area = state.mapX
                    if(state.entered === false){
                        area = --dumbX
                        newMap = state.surroundings.left.areaMap.slice()
                        dispatch(prepSurroundings(area, state.mapY))
                        // dispatch(getMap(area, state.mapY))
                        // dispatch(getMonsters(state.mapX, state.mapY))
                    }
                } else {
                    area = state.mapX
                    oldArea = state.mapX
                }
                break;
                
                default: area = state.mapX
            }
        }

        if(direction === 'up' || direction === 'right'){
            mod = type + 1
        } else if(direction === 'left' || direction === 'down'){
            mod = type - 1
        }

        dispatch({
            type: MOVE,
            payload: {
                letter,
                mod,
                type,
                area,
                oldArea,
                entered: state.entered,
                mapX: state.mapX,
                mapY: state.mapY,
                newMap
            }
        })
        
    }
}

export function updateArea(X, Y) {
    return {
        type: UPDATE_AREA,
        payload: {X, Y}
    }
}


export function getMap(areaX, areaY){

    return {
        type: GET_MAP,
        payload: buildMap(areaX, areaY)
    }
  }

export function prepSurroundings(areaX, areaY){
    return {
        type: PREP_SURR,
        payload: {up: buildMap(areaX, areaY + 1), down: buildMap(areaX, areaY - 1), left: buildMap(areaX - 1, areaY), right: buildMap(areaX + 1, areaY)}
    } 
}


//Reducer

export default function mapReducer(state=initialState, action) {
    switch(action.type) {
        // case GET_MAP + '_PENDING':
        //     return {
        //         ...state,
        //         isLoading: true
        //     }
        case GET_MAP:
            return {
                ...state,
                isLoading: false,
                locations: action.payload.locations,
                areaMap: action.payload.areaMap,
                // activeSpot: action.payload.locations.find(spot => (spot.x_location === state.heroX && spot.y_location === state.heroY)) || {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'}
            }

        case UPDATE_AREA:
            return {
                ...state,
                mapX: action.payload.X,
                mapY: action.payload.Y
            }


        case MOVE:
            let {mod, type, letter, area, oldArea, entered, newMap} = action.payload
            let otherLet = ''
            let otherData = 0
            let otherArea = 1

            let activeSpot = {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'}
            switch(action.payload.letter){
                case 'X':
                    otherLet = 'Y'
                    otherData = state.heroY
                    otherArea = state.mapY
                    // activeSpot = state.locations.filter(spot => {return(spot.x_location === action.payload.mod && spot.y_location === state.heroY)})[0] || {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'}
                    break;
                case 'Y':
                    otherLet = 'X'
                    otherData = state.heroX
                    otherArea = state.mapX
                    // activeSpot = state.locations.filter(spot => {return(spot.x_location === state.heroX && spot.y_location === action.payload.mod)})[0] || {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'}
                    break;
                default: return null
            }
            if(entered === true){
                if(mod > 10){
                    mod = 10
                } else if(mod < 1){
                    mod = 1
                }

                return {
                    ...state,
                    [`hero${letter}`]: mod,
                    [`heroPrev${letter}`]: type,
                    [`heroPrev${otherLet}`]: otherData,
                    [`map${letter}`]: area,
                    activeSpot,
                    areaMap: newMap
                }
            }

            return {
                ...state,
                [`hero${letter}`]: mod,
                [`heroPrev${letter}`]: type,
                [`heroPrev${otherLet}`]: otherData,
                [`map${letter}`]: area,
                [`map${otherLet}`]: otherArea,
                [`mapPrev${letter}`]: oldArea,
                [`mapPrev${otherLet}`]: otherArea,
                activeSpot,
                moveCounter: ++state.moveCounter,
                areaMap: newMap
            }

        case GO_BACK:
            
            return {
                ...state,
                heroX: state.heroPrevX,
                heroY: state.heroPrevY,
                mapX: state.mapPrevX,
                mapY: state.mapPrevY,
                activeSpot: state.locations.filter(spot => {return(spot.x_location === state.heroPrevX && spot.y_location === state.heroPrevY)})[0] || {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'}
            }

        case ENTER_AREA:
            return {
                ...state,
                areaMap: action.payload.areaMap,
                locations: action.payload.locations,
                retreatX: state.heroPrevX,
                retreatY: state.heroPrevY,
                heroX: 5,
                heroY: 1,
                activeSpot: action.payload.locations.filter(spot => {return(spot.x_location === 5 && spot.y_location === 1)})[0] || {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'},
                entered: action.payload.entered,
                clearLocX: action.payload.X,
                clearLocY: action.payload.Y
            }
        case RETREAT:
            return {
                ...state,
                entered: action.payload,
                heroX: state.retreatX,
                heroY: state.retreatY,
                activeSpot: state.locations.filter(spot => {return(spot.x_location === state.retreatX && spot.y_location === state.retreatY)})[0] || {area_name: 'none', area_type: 'none', x_location: 'none', y_location: 'none', discovered_by: 'none'},
                // mapX: state.mapPrevX,
                // mapY: state.mapPrevY
                // not gonna work unless a check is done first
            }


        case PREP_SURR:
            return {
                ...state,
                surroundings: action.payload
            }

        default:
            return state
    }

}







function buildMap(areaX, areaY){
    let areaMap = [];
    let currRow = [];
    for(let row = areaY * 10, col = -9 + (areaX * 10); row > -10 + (areaY * 10); col++){
    
        let discovered = null
        // response.data.filter(spot => {
        //     return spot.x_location === col && spot.y_location === row
        // })
        // if(!discovered[0]){
        //     discovered = null
        // }

      if(col === 10 * areaX){
        if(discovered !== null){
            let color = colorGen(discovered[0].area_type)

            currRow.push({
                x: discovered[0].x_location,
                y: discovered[0].y_location,
                type: discovered[0].area_type,
                name: discovered[0].area_name,
                discovered_by: discovered[0].discovered_by,
                color
            })
            areaMap.push(currRow)
            
            currRow = []
            
            col = -10 + (areaX * 10);
            row--
        } else {
            currRow.push({x: col, y: row});
            areaMap.push(currRow)
    
            currRow = []
    
            col = -10 + (areaX * 10);
            row--
        }
      } else {
          if(discovered !== null){
            let color = colorGen(discovered[0].area_type)

            currRow.push({
                x: discovered[0].x_location,
                y: discovered[0].y_location,
                type: discovered[0].area_type,
                name: discovered[0].area_name,
                discovered_by: discovered[0].discovered_by,
                color
            })
          } else {
              currRow.push({
                  x: col, 
                  y: row,
                  type: undefined,
                  name: undefined,
                  discovered_by: undefined
                })

          }
      }
    }
    return {
        areaMap,
        // locations: response.data
    }

}


function colorGen(place) {
    switch(place){
        case 'Town': 
            return '#808080';
        case 'Plains': 
            return '#90ee90';
        case 'Forest': 
            return '#006400';
        case 'Ocean':
            return '#00008b'
        case 'River':
            return '#add8e6'
        case 'Mountains':
            return '#803605'
        case 'Desert':
            return '#f2a23a'
        default: return 'white'
    }
}