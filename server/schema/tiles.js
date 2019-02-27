const { gql } = require('apollo-server-express');

module.exports = {
  typeDefs: gql`
    scalar Date

    type Subscription {
    }

    type Query {

    }

    type Mutation {
    }

    type Character {
      _id: ID!
    }

    interface Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }

    type Wall implements Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }
    
    type Floor implements Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }

    type Escalator implements Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }

    type Vortex implements Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }

    type Searchable implements Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }

    type Exit implements Tile {
      _id: ID!,
      walkable: Boolean!,
      connector: Boolean!,
    }
    `,
};
