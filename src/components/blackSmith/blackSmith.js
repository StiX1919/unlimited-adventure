import React, {useState, useEffect} from 'react'
import axios from 'axios'


function BlackSmith(props){
    let [mods, setMods] = useState([{type: 'static'}])
    let [weapons, setWeapons] = useState([])

    useEffect(() => {
        axios.get('/api/weapons').then(res => {
            setWeapons(res.data)
        })
    } ,[])  




    let modList = mods.map((mod, i) => {
        return <h4>{mod.type}</h4>
    })
    let weaponList = weapons.map((weapon, i) => {
        return <h4>{weapon.name}</h4>
    })
    return (
        <div>
            {modList}
            <br/>
            {weaponList}
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