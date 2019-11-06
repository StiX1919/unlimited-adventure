import React, {useState} from 'react'


function BlackSmith(props){
    let [mods, setMods] = useState([{type: 'static'}])

    let modList = mods.map((mod, i) => {
        return <h4>{mod.type}</h4>
    })
    return (
        <div>
            {modList}
        </div>

    )
}



export default BlackSmith