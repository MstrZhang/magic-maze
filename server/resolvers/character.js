const _ = require('lodash');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const logger = require('../common/logger');
const { rotateList } = require('../common/utils');
const {
  DIRECTIONS,
  WALL_TYPE,
  VORTEX_TYPE,
  ESCALATOR_TYPE,
  SEARCH_TYPE,
  ITEM_TYPE,
  ENTRY_TYPE,
  EXIT_TYPE,
} = require('../common/consts');

const vortexMovement = (gameState, startTile, endTile, character) => (
  gameState.vortexEnabled
  && startTile.type === VORTEX_TYPE
  && endTile.type === VORTEX_TYPE
  && startTile.colour === character.colour
  && endTile.colour === character.colour
);

const escalatorMovement = (startTile, endTile) => (
  startTile.type === ESCALATOR_TYPE
  && endTile.type === ESCALATOR_TYPE
  && startTile.mazeTileID === endTile.mazeTileID
);

const moveDirection = async (gameState, characterColour, currTile, endTile, direction, models) => {
  if (currTile === null || currTile.type === WALL_TYPE) {
    return false;
  }
  const characterCollision = _.filter(
    gameState.characters,
    char => (char.colour !== characterColour
        && char.coordinates.x === currTile.coordinates.x
        && char.coordinates.y === currTile.coordinates.y),
  );

  if (characterCollision.length > 0) return false;
  if (currTile.coordinates.x === endTile.coordinates.x
      && currTile.coordinates.y === endTile.coordinates.y) {
    return true;
  }
  return moveDirection(
    gameState,
    characterColour,
    await models.Tile.findOne({
      gameStateID: ObjectId(gameState._id),
      _id: currTile.neighbours[direction],
    }),
    endTile,
    direction,
    models,
  );
};

const checkCharactersOnTile = async (gameStateID, tileType, models) => {
  let counts;
  if (tileType === EXIT_TYPE) {
    counts = await models.GameState
      .countDocuments({ _id: gameStateID, 'characters.characterEscaped': true });
  } else if (tileType === ITEM_TYPE) {
    counts = await models.GameState
      .countDocuments({ _id: gameStateID, 'characters.itemClaimed': true });
  }

  if (counts === 4) {
    if (tileType === EXIT_TYPE) {
      await models.GameState.updateOne({ _id: gameStateID }, { allCharactersEscaped: true });
    } else if (tileType === ITEM_TYPE) {
      await models.GameState.updateOne({ _id: gameStateID }, {
        allItemsClaimed: true,
        vortexEnabled: false,
      });
    }
  }
};

const updateItemClaimed = async (gameStateID, endTile, characterColour, models) => {
  await models.GameState.updateOne({
    _id: gameStateID,
    'characters.colour': characterColour,
  },
  {
    $set: {
      'characters.$.itemClaimed': endTile.type === ITEM_TYPE,
    },
  });
};

const updateCharacterEscaped = async (gameStateID, endTile, characterColour, models) => {
  await models.GameState.updateOne({
    _id: gameStateID,
    'characters.colour': characterColour,
  },
  {
    $set: {
      'characters.$.itemClaimed': endTile.type === EXIT_TYPE,
    },
  });
};

const updateTileOrientation = async (gameStateID, nextMazeTileID, orientation, models) => {
  await models.GameState.updateOne({
    _id: gameStateID,
    'mazeTiles._id': nextMazeTileID,
  }, { $set: { 'mazeTiles.$.orientation': orientation } });
  const tiles = await models.Tile.find({ mazeTile: nextMazeTileID }).toArray();

  await Promise.all(tiles.map(async (tile) => {
    const newNeighbours = rotateList(tile.neighbours, orientation);
    await models.Tile.updateOne({ _id: tile._id }, { $set: { neighbours: newNeighbours } });
  }));
};

const setCoordinates = async (tile, x, y, models) => {
  if (tile !== null && tile.type !== WALL_TYPE && tile.coordinates !== null) {
    const coordinates = { x, y };
    await models.Tile.updateOne({ _id: ObjectId(tile._id) }, { $set: { coordinates } });
    await Promise.all(tile.neighbours.map(async (neighbour, index) => {
      switch (index) {
        case DIRECTIONS.UP:
          await setCoordinates(neighbour, x, y - 1, models);
          break;
        case DIRECTIONS.LEFT:
          await setCoordinates(neighbour, x - 1, y, models);
          break;
        case DIRECTIONS.DOWN:
          await setCoordinates(neighbour, x, y + 1, models);
          break;
        case DIRECTIONS.RIGHT:
          await setCoordinates(neighbour, x + 1, y, models);
          break;
        default:
          break;
      }
    }));
  }
};

const updateAdjacentMazeTiles = async (
  gameStateID,
  searchTile,
  entryTile,
  nextMazeTile,
  models,
) => {
  // update the previous search and current entry tile's neighbours
  await Promise.all([
    models.Tile.findOneAndUpdate({
      _id: searchTile._id,
      gameStateID,
      'neighbours.$': null,
    }, {
      $set: { 'neighbours.$': entryTile._id, searched: true },
    }),
    models.Tile.findOneAndUpdate({
      _id: entryTile._id,
      gameStateID,
      'neighbours.$': null,
    }, {
      $set: { 'neighbours.$': searchTile._id },
    }),
  ]);

  // look for current maze tile's search tiles and update their neighbours if they exist
  const searchTiles = await models.Tile.find({
    gameStateID,
    mazeTileID: ObjectId(nextMazeTile._id),
    type: SEARCH_TYPE,
    searched: false,
  }).toArray();

  await Promise.all(searchTiles.forEach(async (tile) => {
    const direction = _.findIndex(tile.neighbours, t => t === null);
    let coordinatesToFind;
    switch (direction) {
      case DIRECTIONS.UP:
        coordinatesToFind = { x: tile.coordinates.x, y: tile.coordinates.y - 1 };
        break;
      case DIRECTIONS.LEFT:
        coordinatesToFind = { x: tile.coordinates.x - 1, y: tile.coordinates.y };
        break;
      case DIRECTIONS.DOWN:
        coordinatesToFind = { x: tile.coordinates.x, y: tile.coordinates.y + 1 };
        break;
      case DIRECTIONS.RIGHT:
        coordinatesToFind = { x: tile.coordinates.x + 1, y: tile.coordinates.y };
        break;
      default:
        throw Error('Search tile is already used');
    }

    // update adjacent tiles if they exist
    // not sure if this syntax works
    const adjTile = await models.Tile.findOneAndUpdate({
      gameStateID,
      coordinates: coordinatesToFind,
      'neighbours.$': null,
    }, {
      $set: {
        searched: true,
        'neighbours.$': tile._id,
      },
    });

    // update current maze tile's tile neighbour with adjacent
    if (adjTile) {
      await models.Tile.findOneAndUpdate({
        gameStateID,
        _id: tile._id,
        'neighbours.$': null,
      }, {
        $set: {
          searched: true,
          'neighbours.$': adjTile._id,
        },
      });
    }
  }));
};

const setCornerCoordinate = async (gameStateID,
  entryTileID,
  entryTileDir,
  nextMazeTileID,
  models,
) => {
  let cornerCoordinates;
  const { x, y } = await models.Tile.findOne({
    _id: entryTileID,
  }, { _id: 0, coordinates: 1 });

  switch (entryTileDir) {
    case DIRECTIONS.UP:
      cornerCoordinates = { x: x - 2, y };
      break;
    case DIRECTIONS.LEFT:
      cornerCoordinates = { x, y: y - 1 };
      break;
    case DIRECTIONS.DOWN:
      cornerCoordinates = { x: x - 1, y: y - 3 };
      break;
    case DIRECTIONS.RIGHT:
      cornerCoordinates = { x: x - 3, y: y - 2 };
      break;
    default:
      break;
  }

  await models.GameState.findOneAndUpdate({
    _id: gameStateID,
    'mazeTiles.$._id': nextMazeTileID,
  }, {
    $set: {
      'mazeTiles.$.cornerCoordinates': cornerCoordinates,
    },
  });
};

module.exports = {
  Query: {
  },
  Mutation: {
    moveCharacter: async (_parent, {
      gameStateID,
      userID,
      characterColour,
      endTileCoords,
    }, { models }) => {
      /**
       * Thinking about having a switch case here or something to
       * determine which action the character performed
       * Actions that can happen:
       * Vortex - Make sure both are vortex
       * Escalator - Make sure both are escalator on same mazeTile
       * Move - (up, down, left, right)
       *
       * Also here we need to check if all characters are on top of items
       * which will prob happen when the character moves on to an item
       * we will then check the rest to see if they are on an item too
       *
       * Something similar will happen when they are running exits
       *
       * Basically a lot of helper functions will need to be here
       */

      let direction;

      const gameState = await models.GameState.findOne({ _id: ObjectId(gameStateID) });
      const character = _.find(gameState.characters, char => char.colour === characterColour);

      const startTile = await models.Tile.findOne({
        gameStateID: ObjectId(gameStateID),
        coordinates: character.coordinates,
      });
      const endTile = await models.Tile.findOne({
        gameStateID: ObjectId(gameStateID),
        coordinates: endTileCoords,
      });

      if (!(startTile && endTile && gameState)) {
        logger.error('Start and/or End Tiles, Character or Game State does not exist');
        throw Error('Start and/or End Tiles, Character or Game State does not exist');
      }

      let shouldMove = false;
      let movedStraightLine = false;

      if (startTile.coordinates.x !== endTile.coordinates.x
        && startTile.coordinates.y !== endTile.coordinates.y) {
        // Potentially vortex or escalator
        shouldMove = vortexMovement(gameState, startTile, endTile, character)
          || escalatorMovement(startTile, endTile);
      } else if (startTile.coordinates.y !== endTile.coordinates.y) {
        // Potentially up or down
        direction = startTile.coordinates.y > endTile.coordinates.y
          ? DIRECTIONS.UP
          : DIRECTIONS.DOWN;
        shouldMove = await moveDirection(
          gameState, character.colour, startTile, endTile, direction, models,
        );
        movedStraightLine = shouldMove;
      } else if (startTile.coordinates.x !== endTile.coordinates.x) {
        // Potentially left or right
        direction = startTile.coordinates.x > endTile.coordinates.x
          ? DIRECTIONS.LEFT
          : DIRECTIONS.RIGHT;
        shouldMove = await moveDirection(
          gameState, character.colour, startTile, endTile, direction, models,
        );
        movedStraightLine = shouldMove;
      }

      if (movedStraightLine) {
        if (!gameState.allItemsClaimed) {
          await updateItemClaimed(ObjectId(gameStateID), endTile, character.colour, models);
          await checkCharactersOnTile(ObjectId(gameStateID), ITEM_TYPE, models);
        }
        if (gameState.allItemsClaimed && !gameState.allCharactersEscaped) {
          await updateCharacterEscaped(ObjectId(gameStateID), character, endTile, models);
          await checkCharactersOnTile(ObjectId(gameStateID), EXIT_TYPE, models);
        }
      }

      if (shouldMove) {
        // update character
        const { coordinates } = endTile;
        // update to db
        await models.GameState.updateOne({
          _id: ObjectId(gameStateID),
          'characters.colour': characterColour,
        },
        {
          $set: {
            'characters.$.coordinates': coordinates,
          },
        });
      }

      const gs = await models.GameState.findOne({ _id: ObjectId(gameStateID) });
      return _.find(gs.characters, char => char.colour === characterColour);
    },
    searchAction: async (_parent, {
      gameStateID,
      characterCoords,
      searchTileCoords,
    }, { models }) => {
      /**
       * First we must check there are tile to pop out of gameState
       *
       * After that, we pop the next tile from the gameState and find out where
       * its entry tile is located (like which side it's on), then we must line
       * up the entry tile with the search `tile` that was passed in
       *
       * After finding the orientation, we update the MazeTile with the new
       * orientation and then update the tiles inside of it so that their
       * neighbours are properly oriented
       *
       * After that we must traverse through the tiles and update coordinates
       *
       * After we will look for the edge case where the new mazetile lines up
       * with another mazetile separate from the one they came from (use the
       * unused_search from gameState)
       *
       * After we will update mazetile adjacent maze tiles
       *
       * in the end we return game state
       */

      const gameState = await models.GameState
        .findOne({ _id: ObjectId(gameStateID) });
      const character = _.find(gameState.characters, char => (
        char.coordinates.x === characterCoords.x
        && char.coordinates.y === characterCoords.y
      ));
      const searchTile = await models.Tile
        .findOne({
          gameStateID: ObjectId(gameStateID),
          coordinates: searchTileCoords,
          type: SEARCH_TYPE,
        });
      const nextMazeTile = _.find(gameState.mazeTiles, mt => !mt.cornerCoordinates);

      if (searchTile
        && (searchTile.type !== SEARCH_TYPE
        || character.colour !== searchTile.colour
        || nextMazeTile === undefined)) {
        return gameState;
      }

      const searchTileDir = _.findIndex(searchTile.neighbours, neighbour => neighbour === null);

      const entryTile = await models.Tile.findOne({
        gameStateID: ObjectId(gameStateID),
        mazeTileID: ObjectId(nextMazeTile._id),
        type: ENTRY_TYPE,
      });

      let entryTileDir = _.findIndex(entryTile.neighbours, neighbour => neighbour === null);

      // Someone check this logic makes sense, basically trying to line up the search with
      // entry tile basically if the search tile has a null in neighbour at index 2 entry
      // tile needs a null at index 0 for them to be lined up
      let orientation = 0;
      while (Math.abs(searchTileDir - entryTileDir) !== 2 && orientation < 3) {
        orientation += 1;
        entryTileDir = (entryTileDir + 1) % 4;
      }

      // Change orientation for nextMazeTile and all the tile's neighbours
      await updateTileOrientation(
        ObjectId(gameStateID), ObjectId(nextMazeTile._id), orientation, models,
      );

      // Set coordinates for tiles
      await setCoordinates(entryTile, searchTile.coordinates.x, searchTile.coordinates.y, models);

      // Need to check the edge cases for adjacent mazetiles and update them
      await updateAdjacentMazeTiles(
        ObjectId(gameStateID),
        searchTile,
        entryTile,
        nextMazeTile,
        models,
      );

      // update the cornerCoordinates of the nextMazeTile
      await setCornerCoordinate(
        ObjectId(gameStateID),
        ObjectId(entryTile._id),
        entryTileDir,
        ObjectId(nextMazeTile._id),
        models,
      );

      return gameState;
    },
  },
};
