const { gql } = require('apollo-server-express');

module.exports = gql`
  """A card representing the set of 1-2 actions a player can perform"""
  type ActionCard {
    "ID of the action card"
    _id: ID!
    "List of actions"
    actions: [Action!]!
    "List of player counts that can use this action card"
    playerCount: [Int!]!
  }
`;
