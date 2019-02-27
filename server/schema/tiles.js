const { gql } = require('apollo-server-express');

module.exports = gql`
  interface Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
  }

  type Entry implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
  }

  type Wall implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
  }

  type Escalator implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
  }

  type Vortex implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
    colour: String!
  }

  type Connector implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
    colour: String!
  }

  type Item implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
    colour: String!
  }

  type Exit implements Tile {
    _id: ID!
    coordinates: Coordinates
    neighbours: [Tile!]
    colour: String!
  }
`;
