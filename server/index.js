require('dotenv').config();

const express = require('express')
const session = require('express-session')
const massive = require('massive')

const {getMonsters} = require('./controllers/monsterCon.js')
const {getWeapons} = require('./controllers/blacksmithCon.js')

const port = 3001

const app = express()

app.use(express.json())


massive(process.env.CONNECTION_STRING)
    .then(db => {
        console.log('app set')
        app.set("db", db);
    })
    .catch(err => console.log('massive-err', err));

app.use(session({
    secret: 'wahahieowo',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000
    }
}))

app.put('/api/callingServer', (req, res, next) => {
    let {name} = req.body
    console.log('hit')
    req.app.get('db').callToDb(name).then((response) => {
        console.log(response)
        res.status(200).send(response)
    })
})



//Monster calls
app.get('/api/getMonsters/:X/:Y', getMonsters)
app.get('/api/weapons', getWeapons)



app.listen( port, () => {
    console.log(`We are live on PORT: ${port}`)
})