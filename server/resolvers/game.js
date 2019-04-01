const _ = require('lodash');
const mongoose = require('mongoose');
const { PubSub, withFilter } = require('apollo-server-express');

const { ObjectId } = mongoose.Types;
const logger = require('../common/logger');
const { shuffle } = require('../common/utils');
const {
  WALL_TYPE,
  MAZETILE_TILE_CONFIGS,
  CHARACTER_COLOR_CONFIG,
  CHARACTER_COORDINATES_CONFIG,
  TIME,
  CREATED_GAMESTATE,
} = require('../common/consts');

const pubsub = new PubSub();

const mazeTileCreation = async (gameStateID, models) => {
  const mazeTileResult = [];
  // Creates all MazeTile objects and insert to DB
  for (let i = 0; i < 12; i += 1) {
    const cornerCoordinates = i === 0 ? { x: 0, y: 0 } : null;
    const initialMazeTile = {
      _id: ObjectId(),
      orientation: 0,
      cornerCoordinates,
      spriteID: i,
    };
    mazeTileResult.push(initialMazeTile);
  }

  mazeTileResult.forEach(async (mazeTile, i) => {
    // constant used for all wall edges between different tiles
    const wallConst = {
      _id: ObjectId(),
      mazeTileID: mazeTile._id,
      gameStateID,
      coordinates: null,
      neighbours: [],
      type: WALL_TYPE,
    };
    const tileResults = [];
    // Creates all tiles with default values
    for (let j = 0; j < 16; j += 1) {
      const initialTile = {
        _id: ObjectId(),
        mazeTileID: mazeTile._id,
        gameStateID,
        coordinates: null,
      };
      tileResults.push(initialTile);
    }
    // Update tiles neighbours
    await Promise.all(tileResults.map(async (tile, j) => {
      const completeTile = _.merge({}, tile, MAZETILE_TILE_CONFIGS[i][j]);
      completeTile.neighbours = completeTile.neighbours.map((val) => {
        // remap neighbours from the config file to Tile IDs
        switch (val) {
          case null: return null;
          case -1: return wallConst._id;
          default: return tileResults[val]._id;
        }
      });
      await models.Tile.insertOne({ ...completeTile });
    }));
  });
  return mazeTileResult;
};

const characterCreation = async (gameStateID, models) => {
  const shuffledCoordinates = shuffle(CHARACTER_COORDINATES_CONFIG);
  const characters = CHARACTER_COLOR_CONFIG.map((colour, index) => (
    {
      _id: ObjectId(),
      colour,
      itemClaimed: false,
      characterEscaped: false,
      coordinates: shuffledCoordinates[index],
      locked: null,
    }
  ));
  await models.GameState.updateOne({ _id: gameStateID }, { $set: { characters } });
};

const appendMazeTiles = async (gameStateID, allMazeTiles, models) => {
  const mazeTiles = _.concat([allMazeTiles[0]], shuffle(allMazeTiles.splice(1)));
  await models.GameState.updateOne({ _id: gameStateID }, { $set: { mazeTiles } });
};

module.exports = {
  Query: {
    gameState: async (_parent, { gameStateID }, { models }) => models.GameState
      .findOne({ _id: ObjectId(gameStateID) }),
  },
  Mutation: {
    createGameState: async (_parent, { lobbyID }, { models }) => {
      await mongoose.connect(process.env.MONGODB_DEV, { useNewUrlParser: true });
      const lobby = await models.Lobby.findOne({ _id: ObjectId(lobbyID) });

      let actions = await models.ActionCard.find({ playerCount: lobby.users.length }).toArray();
      actions = shuffle(actions.map(action => action.actions));
      // create gameState object and get ID
      const initialGameState = {
        vortexEnabled: true,
        allItemsClaimed: false,
        allCharactersEscaped: false,
        endTime: new Date(new Date().getTime() + TIME),
        mazeTiles: [],
        characters: [],
        actions,
        users: lobby.users,
      };

      const gameState = await models.GameState.insertOne({ ...initialGameState });

      const characters = characterCreation(gameState.insertedId, models);

      const allMazeTiles = await mazeTileCreation(gameState.insertedId, models);

      const mazeTiles = await appendMazeTiles(gameState.insertedId, allMazeTiles, models);

      await Promise.all([characters, mazeTiles]);

      pubsub.publish(CREATED_GAMESTATE, { createdGameState: gameState.insertedId, lobbyID });
      return gameState.insertedId;
    },
    deleteGameState: async (_parent, { gameStateID }, { models }) => {
      const deleteGS = await models.GameState.deleteOne({ _id: ObjectId(gameStateID) });
      if (deleteGS.deletedCount > 0) {
        await models.Tile.deleteMany({ gameStateID: ObjectId(gameStateID) });
        return true;
      }
      return false;
    },
  },
  Subscription: {
    createdGameState: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator([CREATED_GAMESTATE]),
        ({ lobbyID }, variables) => (
          ObjectId(lobbyID).equals(ObjectId(variables.lobbyID))
        ),
      ),
    },
  },
};
