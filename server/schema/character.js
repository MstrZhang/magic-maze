const { gql } = require('apollo-server-express');

module.exports = gql`
  type Character {
    _id: ID!
    colour: String!
    gameState: GameState!
    coordinates: Coordinates!
    itemClaimed: Boolean!         # lad standing on Item tile
    characterEscaped: Boolean!    # lad on Exit tile
  }
`;
