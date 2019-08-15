let monsters = [],
    mappedMonsters = [],


    getMonsters = (req, res) => {
        let {X, Y} = req.params
        if(X === 0){
            X = 1
        }
        if(Y === 0){
            Y = 1
        }
        let big = Math.max(X, Y)
        let small = Math.min(X, Y)
        let mapMons = []
        if(!monsters[0]){
            req.app.get('db').getAllMonsters().then( response => {
                monsters = response.slice()
                for(let i = 0; i < 10; i++){
                    let newMon = {...monsters[Math.floor(Math.random() * monsters.length)]}
                    if(newMon.str === 0){
                        newMon.str = 1
                    }
                    if(newMon.spd === 0){
                        newMon.spd = 1
                    }
                    if(newMon.def === 0){
                        newMon.def = 1
                    }

                    let str = (newMon.str + (newMon.str * big)) * small,
                        spd = (newMon.spd + (newMon.spd * big)) * small,
                        def = (newMon.def + (newMon.def * big)) * small,
                        level = (1 + big) * small
    
                    let hp = (str + def) * 2
                    let finalMon = Object.assign(newMon, { level, str, spd, def, hp})
    
                    mapMons.push(finalMon)
                }
                mappedMonsters = mapMons
                res.status(200).send(mappedMonsters)
            })
        }
        else {
            for(let i = 0; i < 10; i++){
                let newMon = {...monsters[Math.floor(Math.random() * monsters.length)]}
                if(newMon.str === 0){
                    newMon.str = 1
                }
                if(newMon.spd === 0){
                    newMon.spd = 1
                }
                if(newMon.def === 0){
                    newMon.def = 1
                }

                let str = (newMon.str + (newMon.str * big)) * small,
                    spd = (newMon.spd + (newMon.spd * big)) * small,
                    def = (newMon.def + (newMon.def * big)) * small,
                    level = (1 + big) * small

                let hp = (str + def) * 2
                let finalMon = Object.assign(newMon, { level, str, spd, def, hp})

                mapMons.push(finalMon)
            }
            mappedMonsters = mapMons
            res.status(200).send(mappedMonsters)
        }
    }




module.exports = {
    getMonsters
}