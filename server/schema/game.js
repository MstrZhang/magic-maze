const { gql } = require('apollo-server-express');

module.exports = gql`
  type GameState {
    _id: ID!
    vortexEnabled: Boolean!
    allItemsClaimed: Boolean!      # all lads standing on Item tile
    allCharactersEscaped: Boolean! # all lads on Exit tile 
    unusedMazeTiles: [ID!]         # list of IDs of unused mazeTiles
  }
`;
