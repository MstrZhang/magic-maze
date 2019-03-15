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
    moveCharacter(
      gameStateID: ID!,
      characterID: Coordinates!,
      startTileID: Coordinates!,
      endTileID: Coordinates!,
    ): GameState!
    searchAction(gameStateID: ID!, characterID: Coordinates!, searchTileID: Coordinates!): GameState!
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
