import React, {useState, useEffect} from 'react'
import axios from 'axios'

import './blackSmith.css'


function BlackSmith(props){
    let [mods, setMods] = useState([{type: 'static'}])
    let [weapons, setWeapons] = useState([])

    useEffect(() => {
        axios.get('/api/weapons').then(res => {
            setWeapons(res.data)
        })
    } ,[])  

    let bars = []
    for(let i = 0; i < 24; i++){
        bars.push(<div key={i} className='vertBar short'/>)
    }



    let modList = mods.map((mod, i) => {
        return <h4>{mod.type}</h4>
    })
    let weaponList = weapons.map((weapon, i) => {
        return <h4>{weapon.name}</h4>
    })
    return (
        <div className='blackSmith'>
            <div className='shopContainer'>
                <div className='horizBar'/>
                <div className='shopInnards'>
                    <div className='vertBar'/>
                    <div className='vertBar'/>
                </div>
                <div className='horizBar'/>
                <div className='shopInnards extend'>
                    {bars}
                </div>
                <div className='horizBar'/>
            </div>

            <div className='manPractice'>

                <div className='head'/>
                <div className='body'>
                    <div className='leftSleeve'/>
                    <div className='leftArm'/>
                    <div className='leftForearm'/>

                    <div className='rightSleeve'/>
                </div>
            </div>
        </div>
    )
}



export default BlackSmith



let demoData = {
    type: 'enchantmentName',
    cost: 'material type',
    level: 0,
    bonus: 'depends on level'
}