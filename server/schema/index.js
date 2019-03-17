const { concatenateTypeDefs, gql } = require('apollo-server-express');
const common = require('./common');
const tiles = require('./tiles');
const character = require('./character');
const game = require('./game');
const mazetile = require('./mazetile');

const queries = gql`
  type Query {
    # GameState
    gameState(gameStateID: ID!): GameState!
  }
`;

const mutations = gql`
  type Mutation {
    # GameState
    createGameState: GameState!
    deleteGameState(gameStateID: ID!): Boolean

    # MazeTile

    # Tile
  
    # Character
    lockCharacter(gameStateID: ID!, colour: String!, userID: ID!): GameState!
    moveCharacter(
      gameStateID: ID!,
      userID: ID,
      characterColour: String!,
      endTileCoords: CoordinatesInput!,
<<<<<<< HEAD
    ): Character!
    searchAction(gameStateID: ID!, characterID: CoordinatesInput!, searchTileID: CoordinatesInput!): GameState!
=======
    ): GameState!
    searchAction(gameStateID: ID!, characterCoords: CoordinatesInput!, searchTileCoords: CoordinatesInput!): GameState!
>>>>>>> d593533be38a9429ae74a1577b9720d328f9bf84
  }
`;

module.exports = concatenateTypeDefs([
  queries,
  mutations,
  common,
  tiles,
  character,
  game,
  mazetile,
]);
