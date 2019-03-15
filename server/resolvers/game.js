const _ = require('lodash');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const logger = require('../common/logger');
const { shuffle } = require('../common/utils');
const {
  WALL_TYPE,
  SEARCH_TYPE,
  MAZETILE_TILE_CONFIGS,
  CHARACTER_COLOR_CONFIG,
  CHARACTER_COORDINATES_CONFIG,
} = require('../common/consts');

const mazeTileCreation = async (gameStateID, models) => {
  const mazeTileResult = [];
  // Creates all MazeTile objects and insert to DB
  for (let i = 0; i < 12; i += 1) {
    const initialMazeTile = {
      orientation: 0,
      adjacentMazeTiles: [],
      gameState: gameStateID,
      spriteID: i,
    };
    mazeTileResult.push(models.MazeTile.insertOne({ ...initialMazeTile }));
  }

  await Promise.all(mazeTileResult).then((res) => {
    // iterate over all the mazetiles created
    res.forEach(async (mazeTile, i) => {
      // constant used for all wall edges between different tiles
      const wallConst = {
        _id: ObjectId(),
        mazeTile: mazeTile.insertedId,
        coordinates: null,
        neighbours: [],
        type: WALL_TYPE,
      };
      const tileResults = [];
      // Creates all tiles with default values
      for (let j = 0; j < 16; j += 1) {
        const initialTile = {
          _id: ObjectId(),
          mazeTile: mazeTile.insertedId,
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
  });
};

const characterCreation = async (gameStateID, models) => {
  const shuffledCoordinates = shuffle(CHARACTER_COORDINATES_CONFIG);
  CHARACTER_COLOR_CONFIG.forEach((colour, index) => {
    const initalCharacter = {
      colour,
      gameState: gameStateID,
      itemClaimed: false,
      characterEscaped: false,
      coordinates: shuffledCoordinates[index],
    };
    models.Character.insertOne({ ...initalCharacter });
  });
};

const updateUnusedMazeTiles = async (gameStateID, models) => {
  const allMazeTiles = await models.MazeTile.find({ gameState: ObjectId(gameStateID) })
    .sort({ spriteID: 1 }).toArray();
  const reorderedMazeTiles = _.concat([allMazeTiles[0]], shuffle(allMazeTiles.splice(1)))
    .map(mazeTile => mazeTile._id);
  await models.GameState
    .updateOne({ _id: gameStateID }, { $set: { unusedMazeTiles: reorderedMazeTiles } });
};

module.exports = {
  Query: {
    gameState: async (_parent, { gameStateID }, { models }) => models.GameState
      .findOne({ _id: ObjectId(gameStateID) }),
  },
  Mutation: {
    createGameState: async (_parent, _args, { models }) => {
      await mongoose.connect(process.env.MONGODB_DEV, { useNewUrlParser: true });

      // create gameState object and get ID
      const initialGameState = {
        vortexEnabled: true,
        allItemsClaimed: false,
        allCharactersEscaped: false,
        unusedSearches: [],
        unusedMazeTiles: [],
      };

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const gameState = await models.GameState.insertOne({ ...initialGameState });

        const characters = characterCreation(gameState.insertedId, models);

        await mazeTileCreation(gameState.insertedId, models);

        const updateMazeTile = updateUnusedMazeTiles(gameState.insertedId, models);

        await Promise.all([characters, updateMazeTile]);
        await session.commitTransaction();
        session.endSession();
        return gameState.insertedId;
      } catch (err) {
        logger.error(err);
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    },
    updateGameStateItems: async (_parent, args, { models }) => {
      try {
        const updateParams = {};
        if ('vortexEnabled' in args) updateParams.vortexEnabled = args.vortexEnabled;
        if ('itemsClaimed' in args) updateParams.itemsClaimed = args.itemsClaimed;
        if ('charactersEscaped' in args) updateParams.charactersEscaped = args.charactersEscaped;

        const results = await models.GameState
          .updateOne({ _id: ObjectId(args.gameStateID) }, {
            $set: updateParams,
          });

        if ((results.result.n) > 0) {
          return args.gameStateID;
        }

        throw Error('Could not find game state');
      } catch (err) {
        logger.error(err);
        throw err;
      }
    },
  },
};
