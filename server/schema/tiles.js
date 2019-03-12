const { gql } = require('apollo-server-express');

module.exports = gql`
  input TileInput {
    mazeTile: ID!
    coordinates: CoordinatesInput
    neighbours: [TileInput]
    type: String!
    colour: String
    claimed: Boolean
    used: Boolean
    escaped: Boolean
    searched: Boolean
  }

  interface Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
  }

  type Normal implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
  }

  type Entry implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
  }

  type Wall implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
  }

  type Escalator implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
  }

  type Vortex implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
    colour: String!
  }

  type Search implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
    colour: String!
    searched: Boolean!
  }

  type Item implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
    colour: String!
    claimed: Boolean!
  }

  type Time implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
    used: Boolean!
  }

  type Exit implements Tile {
    _id: ID!
    mazeTile: ID!
    coordinates: Coordinates
    neighbours: [Tile]
    colour: String!
    escaped: Boolean!
  }
`;
