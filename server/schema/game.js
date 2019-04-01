const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  type GameState {
    _id: ID!
    vortexEnabled: Boolean!
    allItemsClaimed: Boolean!      # all lads standing on Item tile
    allCharactersEscaped: Boolean! # all lads on Exit tile
    endTime: Date!
    mazeTiles: [MazeTile!]         # list of of used and unused mazeTiles
    characters: [Character!]
    users: [User!]
    actions: [[Action!]]
  }
`;
