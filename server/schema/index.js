const { concatenateTypeDefs, gql } = require('apollo-server-express');
const common = require('./common');
const tiles = require('./tiles');
const character = require('./character');
const game = require('./game');
const mazetile = require('./mazetile');
const user = require('./user');
const lobby = require('./lobby');
const actionCard = require('./actionCard');

const queries = gql`
  type Query {
    # GameState
    gameState(gameStateID: ID!): GameState

    # Lobby
    lobby(lobbyID: ID!): Lobby!
    lobbies: [Lobby]!
  }
`;

const mutations = gql`
  type Mutation {
    # GameState
    createGameState(lobbyID: ID!): ID!
    deleteGameState(gameStateID: ID!): Boolean
  
    # Character
    lockCharacter(gameStateID: ID!, userID: String!, characterColour: String!): Character!
    moveCharacter(
      gameStateID: ID!,
      userID: String!,
      characterColour: String!,
      endTileCoords: CoordinatesInput!,
    ): Character!
    searchAction(gameStateID: ID!, userID: String, characterCoords: CoordinatesInput!): MazeTile!
  
    # Lobby
    createLobby(userID: ID!): Lobby!
    deleteLobby(lobbyID: ID!, userID: String!): Boolean!
    joinLobby(lobbyID: ID!, userID: String!): Lobby!
    leaveLobby(lobbyID: ID!, userID: String!): Boolean!

  }
`;

const subscriptions = gql`
  type Subscription {
    # GameState
    createdGameState(lobbyID: ID!): ID!
    endTimeUpdated(gameStateID: ID!): Date!
    endGame(gameStateID: ID!): Boolean!
    allItemsClaimed(gameStateID: ID!): Boolean!

    # MazeTile
    mazeTileAdded(gameStateID: ID!): MazeTile!
  
    # Character
    characterUpdated(gameStateID: ID!): Character!

    # Lobby
    lobbiesUpdated: [Lobby]!
    lobbyUsersUpdated(lobbyID: ID!): Lobby!
  }
`;

module.exports = concatenateTypeDefs([
  queries,
  mutations,
  subscriptions,
  common,
  tiles,
  character,
  game,
  mazetile,
  user,
  lobby,
  actionCard,
]);
