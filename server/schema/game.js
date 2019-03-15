const { gql } = require('apollo-server-express');

module.exports = gql`
  type GameState {
    _id: ID!
    vortexEnabled: Boolean!
    itemsClaimed: Boolean!         # all lads standing on Item tile
    charactersEscaped: Boolean!    # all lads on Exit tile
    unusedSearches: [ID!]          # list of IDs of unused Search tiles; used for connecting secondary Search tiles
    unusedMazeTiles: [ID!]         # list of IDs of unused mazeTiles
  }
`;
