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

    # MazeTile
    mazetiles(gameStateID: ID!): [MazeTile!]
    mazetile(mazeTileID: ID!): MazeTile!

    # Tile
    tiles(mazeTileID: ID!): [Tile!]
    tile(tileID: ID!): Tile

    # Character
    characters(gameStateID: ID!) : [Character!]
    character(characterID: ID!): Character!
  }
`;

const mutations = gql`
  type Mutation {
    # GameState
    createGameState: GameState!
    deleteGameState(gameStateID: ID!): Boolean
    updateGameStateItems(gameStateID: ID!, vortexEnabled: Boolean, itemsClaimed: Boolean, charactersEscaped: Boolean): GameState!

    # MazeTile

    # Tile
  
    # Character
    moveCharacter(gameStateID: ID!, characterID: ID!, startTileID: ID!, endTileID: ID!): Character!
    searchAction(gameStateID: ID!, characterID: ID!, searchTileID: ID!): GameState!
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
