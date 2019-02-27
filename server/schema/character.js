const { gql } = require('apollo-server-express');

module.exports = gql`
  type Character {
    _id: ID!
    colour: String!
  }
`;
