import axios from "axios";


//Action Constants
let UPDATE_STATS = "UPDATE_STATS"
let RESET_STAT = 'RESET_STAT'
let CONVERSION = 'CONVERSION'

let UPDATE_NAME = 'UPDATE_NAME'

let zodiac = [
    {index: 0, name: 'dragon', stats: [10, 0, 5, 10, 0]},
    {index: 1, name: 'goblin', stats: [0, 10, 5, 5, 5]},
    {index: 2, name: 'slime', stats: [0, 5, 20, 0, 0]},
    {index: 3, name: 'griffon', stats: [10, 10, 5, 0, 0]},
    {index: 4, name: 'fairy', stats: [0, 5, 0, 10, 10]},
    {index: 5, name: 'angel', stats: [0, 5, 0, 10, 10]},
    {index: 6, name: 'wolf', stats: [5, 15, 5, 0, 0]},
    {index: 7, name: 'mermaid', stats: [0, 5, 0, 10, 10]},
    {index: 8, name: 'giant', stats: [15, 0 ,10 , 0, 0]},
    {index: 9, name: 'ghost', stats: [0, 5, 5, 5, 10]},
    {index: 10, name: 'gorgon', stats: [0, 10, 0, 10, 5]},
    {index: 11, name: 'demon', stats: [5, 5, 0, 10, 5]}
]  
let months = [
    {name: 'January', start: 0, end: 2},
    {name: 'February', start: 1, end: 3},
    {name: 'March', start: 2, end: 4},
    {name: 'April', start: 3, end: 0},
    {name: 'May', start: 4, end: 1},
    {name: 'June', start: 0, end: 3},
    {name: 'July', start: 1, end: 4},
    {name: 'August', start: 2, end: 0},
    {name: 'September', start: 3, end: 1},
    {name: 'October', start: 4, end: 2},
    {name: 'November', start: 0, end: 1},
    {name: 'December', start: 3, end: 4},
] 
let key = {
    'a': 1,
    'b': 2,
    'c': 3,
    'd': 4,
    'e': 5,
    'f': 6,
    'g': 7,
    'h': 8,
    'i': 9,
    'j': 10,
    'k': 11,
    'l': 12,
    'm': 13,
    'n': 14,
    'o': 15,
    'p': 16,
    'q': 17,
    'r': 18,
    's': 19,
    't': 20,
    'u': 21,
    'v': 22,
    'w': 23,
    'x': 24,
    'y': 25,
    'z': 26,
}
//Initial State

const initialState = {
    loading: false,
    hero: {
        name: '',
        stats: {
            power: 375,
            endurance: 375,
            agility: 375,
            intelligence: 375,
            wisdom: 375,
            attributes: {
                heat: 1,
                cold: 1, 
                static: 1,
                gust: 1,
                soil: 1,
                body: 1,
                mind: 1,
                life: 1,
                death: 1,
                void: 1
            }
        },
        growth: {
            power: 0,
            endurance: 0,
            agility: 0,
            intelligence: 0,
            wisdom: 0
        },
        luck: genLuck()
    },
    used: {
        power: 0,
        endurance: 0,
        agility: 0,
        intelligence: 0,
        wisdom: 0
    },
    bonusStats: 35
}


//Action Creators
export function updateStats(stat){
    return {
        type: UPDATE_STATS,
        payload: stat
    }
}
export function resetStat(stat){
    return {
        type: RESET_STAT,
        payload: stat
    }
}
export function conversion(age, name, heroName, luck) {
    let splAge = age.split('-')
    let startingStats = nameCon(name)
    let rate = growthRate(splAge[1],splAge[2],splAge[0])
    let bonusAtt = null
    if(heroName){
        bonusAtt = findAttribute(heroName, luck)
    }
    

    return {
        type: CONVERSION,
        payload: {
            stats: {
                power: rate.str + startingStats.str,
                endurance: rate.end + startingStats.end,
                agility: rate.agi + startingStats.agi,
                intelligence: rate.int + startingStats.int,
                wisdom: rate.wis + startingStats.wis
            },
            att: bonusAtt
        }
    }

}


export function updateName(name){
    return {
        type: UPDATE_NAME,
        payload: name
    }
}



//Reducer

export default function mapReducer(state=initialState, action) {
    switch(action.type) {
        case UPDATE_STATS:
            return {
                ...state, 
                bonusStats: --state.bonusStats, 
                hero:{
                    ...state.hero, 
                    stats: {
                        ...state.hero.stats, 
                        [action.payload]: state.hero.stats[action.payload] + (state.hero.stats[action.payload] * .025) + state.hero.luck 
                    }
                },
                used: {
                    ...state.used,
                    [action.payload]: ++state.used[action.payload]
                }
            }

        case RESET_STAT:
            let sum = state.bonusStats + state.used[action.payload]
            return {
                ...state,
                bonusStats: sum,
                used: {
                    ...state.used,
                    [action.payload]: 0
                },
                hero: {
                    ...state.hero,
                    stats: {
                        ...state.hero.stats,
                        [action.payload]: 375,
                    }
                }
            }

        case CONVERSION:
            
            return {
                ...state,
                hero: {
                    ...state.hero,
                    growth: action.payload.stats,
                    stats: {
                        ...state.hero.stats,
                        attributes: {
                            ...state.hero.stats.attributes,
                            [action.payload.att]: 1.1
                        }
                    }
                }
            }

        case UPDATE_NAME:
            return {
                ...state,
                hero: {
                    ...state.hero,
                    name: action.payload
                }
            }

        default:
            return state
    }

}








function genLuck(){
    let luck = Math.floor(Math.random() * 10) + 1
    if(luck === 9){
        luck = Math.floor(Math.random() * 25) + 1
    }
    if(luck === 19){
        luck = Math.floor(Math.random() * 50) + 1
    }
    if(luck === 36){
        luck = Math.floor(Math.random() * 100) + 1
    }
    return luck
}



function nameCon(name){
    let newName = name
    let str = {stat: 0, count: 0},
        agi = {stat: 0, count: 0},
        end = {stat: 0, count: 0},
        int = {stat: 0, count: 0},
        wis = {stat: 0, count: 0}
    let splitName = newName.toLowerCase().split('').filter((letter) => {
        if(key[letter]){
            return true
        }
    })

    for(let i=0; i < splitName.length; i++){
        if(!key[splitName[i]]){
            continue
        }
        else if(i === 0 || i % 5 === 0){
            str.stat += key[splitName[i]]
            str.count++
        }
        else if(i === 1 || i % 5 === 1){
            agi.stat += key[splitName[i]]
            agi.count++
        }
        else if(i === 2 || i % 5 === 2){
            end.stat += key[splitName[i]]
            end.count++
        }
        else if(i === 3 || i % 5 === 3){
            int.stat += key[splitName[i]]
            int.count++
        }
        else if(i === 4 || i % 5 === 4){
            wis.stat += key[splitName[i]]
            wis.count++
        }
    }
    
    return {
        str: !str.stat ? 2 : Math.floor(str.stat / 2 / str.count),
        agi: !agi.stat ? 2 : Math.floor(agi.stat / 2 / agi.count),
        end: !end.stat ? 2 : Math.floor(end.stat / 2 / end.count),
        int: !int.stat ? 2 : Math.floor(int.stat / 2 / int.count),
        wis: !wis.stat ? 2 : Math.floor(wis.stat / 2 / wis.count)
    }
}

function growthRate(month, day, year) {
    let zodiacSign = zodiac[year % 12]
    let growthKey = [
        null, 
        {points: 10, amount: 1},
        {points: 8, amount: 2},
        {points: 6, amount: 3},
        {points: 4, amount: 4},
        {points: 3, amount: 5},
        {points: 2, amount: 6},
        {points: 2, amount: 7},
        {points: 2, amount: 8},
        {points: 2, amount: 9}
    ]
    let stats = [60, 60, 60, 60, 60]
    let zodiacStats = stats.map((item, ind) => {
        return item += zodiacSign.stats[ind]
    })


    var singleNum = 0;
    while (year >= 10 ) {
        singleNum=0;
        while (year > 0) {
            var rem;
            rem = year % 10;
            singleNum = singleNum + rem;
            year = parseInt(year / 10);
        }
        year = singleNum;
    }
    let yearObj = growthKey[singleNum]

    for(let i = 1; i <= yearObj.points; i++){
        let stat = Math.floor(Math.random() * 5)

        zodiacStats[stat] += yearObj.amount
    }
      //added bonuses from year born

    let monthBonus = months[month - 1],
        dayDiff = 0,
        side = null,
        otherSide = null
    if(day > 15){
        dayDiff = day - 15
        side = monthBonus.end
        otherSide = monthBonus.start
    } else if (day <= 15){
        dayDiff = 15 - day
        side = monthBonus.start
        otherSide = monthBonus.end
    }
    zodiacStats[side] += dayDiff
    zodiacStats[otherSide] -= (dayDiff * 2)


    return {
        str: zodiacStats[0], 
        agi: zodiacStats[1],
        end: zodiacStats[2],
        int: zodiacStats[3],
        wis: zodiacStats[4]
    }
}


function findAttribute(name, luck){
    let attKey = ['void', 'heat', 'cold', 'static', 'gust', 'soil', 'body', 'mind', 'life', 'death']
    let attributes= {
            heat: 1,
            cold: 1, 
            static: 1,
            gust: 1,
            soil: 1,
            body: 1,
            mind: 1,
            life: 1,
            death: 1,
            void: 1
        }

    let bestAtt = ''
    let highAtt = 1
    let firstName = name.toLowerCase().split(' ')[0].split('').filter((letter) => {
        if(key[letter]){
            return true
        }
    })
    

    firstName.map((lett) => {

        let index = +key[lett].toString().split('').pop()
        if(luck < 25){
            if(index > 7){
                index = index - 2
            }
            if(index === 0){
                ++index
            }
        }
        attributes[attKey[index]] = ++attributes[attKey[index]]
    })

    for(key in attributes){
        if(attributes[key] > highAtt){
            bestAtt = key
            highAtt = attributes[key]
        }
    }
    return bestAtt
}