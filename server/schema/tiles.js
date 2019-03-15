const { gql } = require('apollo-server-express');

module.exports = gql`
  input TileInput {
    mazeTileID: ID!
    coordinates: CoordinatesInput
    neighbours: [ID]
    type: String!
    colour: String
    used: Boolean
    searched: Boolean
  }

  interface Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Normal implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Entry implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Wall implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Escalator implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
  }

  type Vortex implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
  }

  type Search implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
    searched: Boolean!
  }

  type Item implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
  }

  type Time implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    used: Boolean!
  }

  type Exit implements Tile {
    _id: ID!
    mazeTileID: ID!
    coordinates: Coordinates
    neighbours: [ID]
    colour: String!
  }
`;
