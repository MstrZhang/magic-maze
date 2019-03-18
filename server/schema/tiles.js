const { gql } = require('apollo-server-express');

module.exports = gql`
  interface Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Normal implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Entry implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Wall implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Escalator implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    escalatorID: Int!
  }

  type Vortex implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
  }

  type Search implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
    searched: Boolean!
  }

  type Item implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
  }

  type Time implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    used: Boolean!
  }

  type Exit implements Tile {
    _id: ID!
    mazeTileID: ID!
    gameStateID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
  }
`;
