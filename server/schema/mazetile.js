const { gql } = require('apollo-server-express');

/**
 * Search tiles (if they exist) always occur once per edge and are
 * placed 1 space left from a corner.
 */

module.exports = gql`
  input MazeTileInput {
    orientation: Orientation!
    adjacentMazeTiles: [MazeTileInput!]!
    gameStateID: ID!  # from the GameState model
  }

  type MazeTile {
    _id: ID!
    orientation: Orientation   # o <- [0, 3], rotate graph CCW by o * 90 degrees
    adjacentMazeTiles: [MazeTile!]!
    gameState: ID!
  }
`;
