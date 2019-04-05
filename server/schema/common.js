const { gql } = require('apollo-server-express');

module.exports = gql`
  """A data structure to store x and y coordinates"""
  type Coordinates {
    "x coordinate"
    x: Int
    "y coordinate"
    y: Int
  }

  """The input structure of Coordinates"""
  input CoordinatesInput {
    "x coordinate"
    x: Int!
    "y coordinate"
    y: Int!
  }

  enum Action {
    "Up direction"
    UP
    "Left direction"
    LEFT
    "Down direction"
    DOWN
    "Right direction"
    RIGHT
    "Search action"
    SEARCH
    "Escalator action"
    ESCALATOR
    "Vortex action"
    VORTEX
  }
`;
