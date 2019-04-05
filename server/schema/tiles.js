const { gql } = require('apollo-server-express');

module.exports = gql`
  """A tile that is used in MazeTile. Can be different types"""
  interface Tile {
    "ID of the Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
  }

  """A normal walkable tile with no special features"""
  type Normal implements Tile {
    "ID of the Normal Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
  }

  """The entry point to a maze tile"""
  type Entry implements Tile {
    "ID of the Entry Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
  }

  """A Tile that cannot be stood on or walked through"""
  type Wall implements Tile {
    "ID of the Wall Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
  }

  """An Escalator that allows players to move diagonally"""
  type Escalator implements Tile {
    "ID of the Escalator Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
    "ID of the escalator within its MazeTile"
    escalatorID: Int!
  }

  """A special tile that allows you to teleport to a tile of the same type and same colour"""
  type Vortex implements Tile {
    "ID of the Vortex Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
    "Colour of the Vortex tile"
    colour: String!
  }

  """Allows players to expand the maze by adding a new MazeTile"""
  type Search implements Tile {
    "ID of the Search Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
    "Colour of the Search Tile"
    colour: String!
    "Indicates if the Search Tile has been searched"
    searched: Boolean!
  }

  """A tile with a specific character's item"""
  type Item implements Tile {
    "ID of the Item Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
    "Colour of the Item Tile"
    colour: String!
  }

  """A tile that is used to extend the game's end time"""
  type Time implements Tile {
    "ID of the Time Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
    "If the Time Tile is used"
    used: Boolean!
  }

  """A tile for players to escape the maze"""
  type Exit implements Tile {
    "ID of the Exit Tile"
    _id: ID!
    "MazeTile this tile belongs to"
    mazeTileID: ID!
    "GameState this tile belongs to"
    gameStateID: ID!
    "The x and y coordinates of the tile"
    coordinates: Coordinates
    "List of adjacent tiles"
    neighbours: [ID]
    "Colour of the Exit Tile"
    colour: String!
  }
`;
