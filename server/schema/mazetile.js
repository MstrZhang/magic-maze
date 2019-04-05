const { gql } = require('apollo-server-express');

/**
 * Search tiles (if they exist) always occur once per edge and are
 * placed 1 space left from a corner.
 */

module.exports = gql`
  """A MazeTile which represents a collection of 16 Tiles"""
  type MazeTile {
    "ID of the MazeTile"
    _id: ID!

    "Orientation of the MazeTile. It's a value between 0 and 3 representing each up, left, down, right respectively"
    orientation: Int   # o <- [0, 3], rotate graph CCW by o * 90 degrees

    "The top left coordinates of the maze tile (relative to the rest of the tiles)"
    cornerCoordinates: Coordinates

    "A value between 0 and 11 representing the 12 potential MazeTile configurations"
    spriteID: Int!
  }
`;
