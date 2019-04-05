const { gql } = require('apollo-server-express');

module.exports = gql`
  """Represents the 4 playable characters a User can control"""
  type Character {
    "ID of the Character"
    _id: ID!

    "Character's colour"
    colour: String!

    "Current (x,y) coordinates"
    coordinates: Coordinates!

    "Contains the UserID who controls this Character or it's null (unlocked)"
    locked: String

    "Whether the Character claimed their required item"
    itemClaimed: Boolean!         # lad standing on Item tile

    "Whether the Character escaped the maze (from standing on their exit tile)"
    characterEscaped: Boolean!    # lad on Exit tile
  }
`;
