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
  """Root Query"""
  type Query {
    """Returns the GameState based of the gameStateID"""
    gameState(
      "ID of the current GameState"
      gameStateID: ID!
    ): GameState

    """Returns the Lobby based of the lobbyID"""
    lobby(
      "ID of the current Lobby"
      lobbyID: ID!
    ): Lobby!

    """Returns all the lobbies"""
    lobbies: [Lobby]!
  }
`;

const mutations = gql`
  """Root Mutations"""
  type Mutation {
    """Creates a new GameState based of the lobbyID"""
    createGameState(
      "ID of the current Lobby"
      lobbyID: ID!
    ): ID!
    
    """Deletes the GameState based of the gameStateID"""
    deleteGameState(
      "ID of the current gameState"
      gameStateID: ID!
    ): Boolean
  
    """Locks and unlocks the character to a specific user"""
    lockCharacter(
      "ID of the current GameState"
      gameStateID: ID!,

      "ID of the current User"
      userID: String!,

      "Colour of the selected character"
      characterColour: String!
    ): Character!
    
    """Moves the character if it's a valid move"""
    moveCharacter(
      "ID of the current GameState"
      gameStateID: ID!,

      "ID of the current User"
      userID: String!,

      "Colour of the selected character"
      characterColour: String!,

      "Coordinates to move the character to"
      endTileCoords: CoordinatesInput!,
    ): Character!
    
    """Searches for a new MazeTile piece if action is possible"""
    searchAction(
      "ID of the current GameState"
      gameStateID: ID!,

      "ID of the current User"
      userID: String,
      
      "Coordinates of current character"
      characterCoords: CoordinatesInput!
    ): MazeTile!
  
    """Creates a new lobby with the userID as creator"""
    createLobby(
      "ID of the current User"
      userID: ID!
    ): Lobby!
    """Deletes a lobby as long as userID is in lobby"""
    deleteLobby(
      "ID of the current Lobby"
      lobbyID: ID!,

      "ID of the current User"
      userID: String!
    ): Boolean!
    """Joins a lobby if space exists"""
    joinLobby(
      "ID of the current Lobby"
      lobbyID: ID!,
      
      "ID of the current User"      
      userID: String!
    ): Lobby!
    """Leaves a lobby"""
    leaveLobby(
      "ID of the current Lobby"
      lobbyID: ID!,
      
      "ID of the current User"      
      userID: String!
    ): Boolean!

  }
`;

const subscriptions = gql`
  """Root Subscriptions"""
  type Subscription {
    # GameState
    """Subscriptions to game creation state"""
    createdGameState(
      "ID of the current Lobby"      
      lobbyID: ID!
    ): ID!
    """Subscription for updating game end time"""
    endTimeUpdated(
      "ID of the current GameState"
      gameStateID: ID!
    ): Date!
    """Subsription for updating users when they win the game"""
    endGame(
      "ID of the current GameState"
      gameStateID: ID!
    ): Boolean!
    """Subscription for updating users when all characters have claimed all items"""
    allItemsClaimed(
      "ID of the current GameState"
      gameStateID: ID!
    ): Boolean!

    # MazeTile
    """Subscription for adding in new maze tiles to the map"""
    mazeTileAdded(
      "ID of the current GameState"      
      gameStateID: ID!
    ): MazeTile!
  
    # Character
    """Subscription for updating character state"""
    characterUpdated(
      "ID of the current GameState"
      gameStateID: ID!
    ): Character!

    """Subscription for updating existing lobbies"""
    lobbiesUpdated: [Lobby]!
    """Subscription for updating a specfic lobby's users"""
    lobbyUsersUpdated(
      "ID of the current Lobby"
      lobbyID: ID!
    ): Lobby!
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
