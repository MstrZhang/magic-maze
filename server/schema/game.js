const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  """The state of a game"""
  type GameState {
    "ID of the Game State"
    _id: ID!
    "Are vortex enabled"
    vortexEnabled: Boolean!
    "Are all items claimed"
    allItemsClaimed: Boolean!
    "Have all characters escaped"
    allCharactersEscaped: Boolean!
    "End time of game"
    endTime: Date!
    "List of all the maze tile states"
    mazeTiles: [MazeTile!]         # list of of used and unused mazeTiles
    "List of all the character states"
    characters: [Character!]
    "List of all users in the game"
    users: [User!]
    "List of the actions that are being used in the game"
    actions: [[Action!]]
  }
`;
