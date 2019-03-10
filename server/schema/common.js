const { gql } = require('apollo-server-express');

module.exports = gql`
  enum Orientation {
    UP
    RIGHT
    DOWN
    LEFT
  }

  type Coordinates {
    x: Int!
    y: Int!
  }
`;
