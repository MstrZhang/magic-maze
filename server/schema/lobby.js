const { gql } = require('apollo-server-express');

module.exports = gql`
  """A Lobby which holds the players before they start a game"""
  type Lobby {
    "ID of the Lobby"
    _id: ID!

    "List of Users in the lobby"
    users: [User]
  }
`;
