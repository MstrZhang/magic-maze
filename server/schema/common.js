const { gql } = require('apollo-server-express');

module.exports = gql`
  type Coordinates {
    x: Int
    y: Int
  }

  input CoordinatesInput {
    x: Int!
    y: Int!
  }

  enum Action {
    UP
    LEFT
    DOWN
    RIGHT
    SEARCH
    ESCALATOR
    VORTEX
  }
`;
