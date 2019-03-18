const { gql } = require('apollo-server-express');

module.exports = gql`
  type Character {
    _id: ID!
    colour: String!
    coordinates: Coordinates!
    locked: ID
    itemClaimed: Boolean!         # lad standing on Item tile
    characterEscaped: Boolean!    # lad on Exit tile
  }
`;
