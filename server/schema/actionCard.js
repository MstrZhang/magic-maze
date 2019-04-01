const { gql } = require('apollo-server-express');

module.exports = gql`
  type ActionCard {
    _id: ID!
    actions: [Action!]!
    playerCount: [Int!]!
  }
`;
