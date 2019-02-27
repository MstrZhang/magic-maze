const { gql } = require('apollo-server-express');

module.exports = gql`
  type Coordinates {
    x: Int
    y: Int
  }
`;
