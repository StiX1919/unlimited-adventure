const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Stats {
        power: Int!
        endurance: Int!
        agility: Int!
        intelligence: Int!
        wisdom: Int!
    }
    type Attributes {
            heat: Float!
            cold: Float!
            static: Float!
            gust: Float!
            soil: Float!
            body: Float!
            mind: Float!
            life: Float!
            death: Float!
            void: Float!
        }

    type Hero {
        hero_id: ID!
        hero_name: String!
        stats: Stats!
        attributes: Attributes!
        growth: Stats!
    }

    type Query {
        getHero(id: ID!): Hero
    }

    type Mutation {
        addHero(hero: Int!): Int!
    }
`

module.exports = {typeDefs}
