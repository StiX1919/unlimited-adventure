

const resolvers = {
    Query: {
        async getHero(_, args, ctx) {
            let db = ctx.req.app.get('db')

            let hero = await db.query(`select * from heroes where user_id = ${args.id}`)
                .then(res => {
                    return res[0]
                }).catch(err => console.log('hero err', err))
            let stats = await db.query(`select * from hero_stats where hero_id = ${hero.hero_id}`)
                .then(res => {
                    return res[0]
                }).catch(err => console.log('stat err', err))
            let trueHero = {
                ...hero,
                stats: {
                    ...stats
                }
            }
            return trueHero
        }
    },
    Mutation: {
        addHero(_, args, ctx) {
            let db = ctx.req.app.get('db')

            console.log('add Hit')
            return {hero: 1}
        }
    }
}

module.exports = {
    resolvers
}