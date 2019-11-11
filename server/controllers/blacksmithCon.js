


function getWeapons(req, res){
    let db = req.app.get('db')

    db.query('select * from equipment').then(response => {
        res.status(200).send(response)
        console.log(response, 'weapons')
    })
}

module.exports ={
    getWeapons
}