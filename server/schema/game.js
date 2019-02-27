const { gql } = require('apollo-server-express');

module.exports = gql`
  type GameState {
    vortex_enabled: Boolean!
    items_claimed: Boolean!         # all lads standing on Item tile
    characters_escaped: Boolean!    # all lads on Exit tile
    unused_searches: [ID!]          # list of IDs of unused Search tiles; used for connecting secondary Search tiles
  }
`;
