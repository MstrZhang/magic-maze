const _ = require('lodash');
const mongoose = require('mongoose');
const { PubSub, withFilter } = require('apollo-server-express');

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
  TIME_TYPE,
  TIME,
  ENDTIME_UPDATED,
  END_GAME,
  ALL_ITEMS_CLAIMED,
  MAZETILE_ADDED,
  CHARACTER_COORDINATES_UPDATED,
  CHARACTER_LOCK,
} = require('../common/consts');
const { Action } = require('./actionCard');

const pubsub = new PubSub();

const vortexMovement = (gameState, startTile, endTile, character) => (
  gameState.vortexEnabled
  && startTile.colour === character.colour
  && endTile.colour === character.colour
);

const escalatorMovement = (startTile, endTile) => (
  startTile.escalatorID === endTile.escalatorID
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
  const { characters, allItemsClaimed } = await models.GameState
    .findOne({ _id: gameStateID }, { _id: 0, characters: 1, allItemsClaimed: 1 });
  let counts;
  if (tileType === EXIT_TYPE && allItemsClaimed) {
    counts = _.filter(characters, char => char.characterEscaped).length;
  } else if (tileType === ITEM_TYPE) {
    counts = _.filter(characters, char => char.itemClaimed).length;
  }

  if (counts === 4) {
    if (tileType === EXIT_TYPE) {
      pubsub.publish(END_GAME, { endGame: true, gameStateID });
      await models.GameState.updateOne(
        { _id: gameStateID },
        { $set: { allCharactersEscaped: true } },
      );
    } else if (tileType === ITEM_TYPE) {
      pubsub.publish(ALL_ITEMS_CLAIMED, { allItemsClaimed: true, gameStateID });
      await models.GameState.updateOne({ _id: gameStateID }, {
        $set: {
          allItemsClaimed: true,
          vortexEnabled: false,
        },
      });
    }
  }
};

const updateEndTime = async (gameStateID, endTileID, rotateActions, models) => {
  const newEndTime = new Date(new Date().getTime() + TIME);
  pubsub.publish(ENDTIME_UPDATED, { endTimeUpdated: newEndTime, gameStateID });
  await Promise.all([
    models.GameState.updateOne({
      _id: gameStateID,
    },
    {
      $set: {
        endTime: newEndTime,
        actions: rotateActions,
      },
    }),
    models.Tile.updateOne({
      _id: endTileID,
      gameStateID,
      used: false,
    },
    {
      $set: {
        used: true,
      },
    }),
  ]);
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
      'characters.$.characterEscaped': endTile.type === EXIT_TYPE,
    },
  });
};

const updateTileOrientation = async (gameStateID, nextMazeTileID, orientation, models) => {
  await models.GameState.updateOne({
    _id: gameStateID,
    'mazeTiles._id': nextMazeTileID,
  }, { $set: { 'mazeTiles.$.orientation': orientation } });
  const tiles = await models.Tile.find({ mazeTileID: nextMazeTileID }).toArray();

  await Promise.all(tiles.map(async (tile) => {
    const newNeighbours = rotateList(tile.neighbours, orientation);
    await models.Tile.updateOne({ _id: tile._id }, { $set: { neighbours: newNeighbours } });
  }));
};

const setCoordinates = async (nextMazeTileID, cornerCoordinates, orientation, models) => {
  const allTiles = await models.Tile.find({ mazeTileID: nextMazeTileID }).toArray();
  await Promise.all(allTiles.map(async (tile) => {
    // rotates the x and y coordinates
    let rotateCoordinates;
    switch (orientation) {
      case DIRECTIONS.UP:
        rotateCoordinates = tile.coordinates;
        break;
      case DIRECTIONS.LEFT:
        rotateCoordinates = { x: tile.coordinates.y, y: Math.abs(tile.coordinates.x - 3) };
        break;
      case DIRECTIONS.DOWN:
        rotateCoordinates = {
          x: Math.abs(tile.coordinates.x - 3),
          y: Math.abs(tile.coordinates.y - 3),
        };
        break;
      case DIRECTIONS.RIGHT:
        rotateCoordinates = { x: Math.abs(tile.coordinates.y - 3), y: tile.coordinates.x };
        break;
      default:
        logger.error('Invalid direction');
        throw Error('Invalid direction');
    }
    // adjusts the coordinates so they are relative to the mazeTile corner coords
    const adjustedX = rotateCoordinates.x + cornerCoordinates.x;
    const adjustedY = rotateCoordinates.y + cornerCoordinates.y;

    await models.Tile.updateOne(
      { _id: ObjectId(tile._id) },
      { $set: { coordinates: { x: adjustedX, y: adjustedY } } },
    );
  }));
};

const updateAdjacentMazeTiles = async (
  gameStateID,
  cornerCoordinates,
  nextMazeTileID,
  usedMazeTiles,
  models,
) => {
  const updateResults = [];

  // change array to be all 4 tiles where search/entry tiles `should` be
  const coordsToSearch = [
    { x: cornerCoordinates.x + 2, y: cornerCoordinates.y },
    { x: cornerCoordinates.x, y: cornerCoordinates.y + 1 },
    { x: cornerCoordinates.x + 1, y: cornerCoordinates.y + 3 },
    { x: cornerCoordinates.x + 3, y: cornerCoordinates.y + 2 },
  ];

  const tilesToSearch = await models.Tile.find({
    gameStateID,
    mazeTileID: nextMazeTileID,
    coordinates: { $in: coordsToSearch },
  }).toArray();

  tilesToSearch.forEach(async (tile) => {
    // use index in coordsToSearch array as the direction
    const direction = _.findIndex(
      coordsToSearch,
      c => (c.x === tile.coordinates.x && c.y === tile.coordinates.y),
    );
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
        logger.error('Current tile does not exist');
        throw Error('Current tile does not exist');
    }

    // update adjacent tiles if they exist
    const adjTile = await models.Tile.findOne({
      gameStateID,
      mazeTileID: { $in: usedMazeTiles },
      coordinates: coordinatesToFind,
    });

    // update current maze tile's tile neighbour with adjacent
    if (adjTile) {
      // current and adjacent tiles are both search types, or current is an entry type
      if (adjTile.type === SEARCH_TYPE && (tile.type === SEARCH_TYPE || tile.type === ENTRY_TYPE)) {
        const updateParams = { 'neighbours.$': adjTile._id };
        if (tile.type === SEARCH_TYPE) updateParams.searched = true;

        // add if to differentiate entry and search type
        updateResults.push(
          models.Tile.findOneAndUpdate({
            _id: adjTile._id,
            gameStateID,
            neighbours: { $type: 10 },
          }, {
            $set: { 'neighbours.$': tile._id, searched: true },
          }),
          models.Tile.findOneAndUpdate({
            _id: tile._id,
            gameStateID,
            neighbours: { $type: 10 },
          }, {
            $set: updateParams,
          }),
        );
      } else {
        // either current or adjacent tile is a search type and the other is not
        updateResults.push(
          models.Tile.findOneAndUpdate({
            _id: adjTile._id,
            gameStateID,
            type: SEARCH_TYPE,
          }, {
            $set: { searched: true },
          }),
          models.Tile.findOneAndUpdate({
            _id: tile._id,
            gameStateID,
            type: SEARCH_TYPE,
          }, {
            $set: { searched: true },
          }),
        );
      }
    }
  });

  await Promise.all(updateResults);
};

const setCornerCoordinate = async (
  gameStateID,
  coordinates,
  entryTileDir,
  nextMazeTileID,
  models,
) => {
  let cornerCoordinates;

  switch (entryTileDir) {
    case DIRECTIONS.UP:
      cornerCoordinates = { x: coordinates.x - 2, y: coordinates.y };
      break;
    case DIRECTIONS.LEFT:
      cornerCoordinates = { x: coordinates.x, y: coordinates.y - 1 };
      break;
    case DIRECTIONS.DOWN:
      cornerCoordinates = { x: coordinates.x - 1, y: coordinates.y - 3 };
      break;
    case DIRECTIONS.RIGHT:
      cornerCoordinates = { x: coordinates.x - 3, y: coordinates.y - 2 };
      break;
    default:
      break;
  }

  const gs = await models.GameState.findOneAndUpdate({
    _id: gameStateID,
    'mazeTiles._id': nextMazeTileID,
  }, {
    $set: {
      'mazeTiles.$.cornerCoordinates': cornerCoordinates,
    },
  }, { returnOriginal: false });

  return _.find(gs.value.mazeTiles, mt => ObjectId(mt._id).equals(ObjectId(nextMazeTileID)));
};

module.exports = {
  Query: {
  },
  Subscription: {
    allItemsClaimed: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ALL_ITEMS_CLAIMED]),
        ({ gameStateID }, variables) => (
          ObjectId(gameStateID).equals(ObjectId(variables.gameStateID))
        ),
      ),
    },
    endTimeUpdated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator([ENDTIME_UPDATED]),
        ({ gameStateID }, variables) => (
          ObjectId(gameStateID).equals(ObjectId(variables.gameStateID))
        ),
      ),
    },
    endGame: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator([END_GAME]),
        ({ gameStateID }, variables) => (
          ObjectId(gameStateID).equals(ObjectId(variables.gameStateID))
        ),
      ),
    },
    mazeTileAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator([MAZETILE_ADDED]),
        ({ gameStateID }, variables) => (
          ObjectId(gameStateID).equals(ObjectId(variables.gameStateID))
        ),
      ),
    },
    characterUpdated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHARACTER_COORDINATES_UPDATED, CHARACTER_LOCK]),
        ({ gameStateID }, variables) => (
          ObjectId(gameStateID).equals(ObjectId(variables.gameStateID))
        ),
      ),
    },
  },
  Mutation: {
    moveCharacter: async (_parent, {
      gameStateID,
      userID,
      characterColour,
      endTileCoords,
    }, { models }) => {
      let direction;

      const gameState = await models.GameState.findOne({ _id: ObjectId(gameStateID) });
      const character = _.find(gameState.characters, char => char.colour === characterColour);
      const userIndex = _.findIndex(gameState.users, user => (user.uid === userID));

      if (userIndex === -1) throw Error('User does not exist in game');

      const usedMazeTiles = _.reduce(gameState.mazeTiles, (array, mt) => {
        if (mt.cornerCoordinates) array.push(ObjectId(mt._id));
        return array;
      }, []);

      const startTile = await models.Tile.findOne({
        gameStateID: ObjectId(gameStateID),
        mazeTileID: { $in: usedMazeTiles },
        coordinates: character.coordinates,
      });
      const endTile = await models.Tile.findOne({
        gameStateID: ObjectId(gameStateID),
        mazeTileID: { $in: usedMazeTiles },
        coordinates: endTileCoords,
      });

      if (!(startTile && endTile && gameState)) {
        logger.error('Start and/or End Tiles, Character or Game State does not exist');
        throw Error('Start and/or End Tiles, Character or Game State does not exist');
      }

      let specialMovement = false;
      let movedStraightLine = false;

      // checks for vortex movement or escalator movement
      if (startTile.type === VORTEX_TYPE
        && endTile.type === VORTEX_TYPE
        && gameState.actions[userIndex].includes(Action.VORTEX)) {
        // Potentially vortex or escalator
        specialMovement = vortexMovement(gameState, startTile, endTile, character);
      } else if (startTile.type === ESCALATOR_TYPE
        && endTile.type === ESCALATOR_TYPE
        && gameState.actions[userIndex].includes(Action.ESCALATOR)) {
        specialMovement = escalatorMovement(startTile, endTile);
      }

      // checks for horizontal or vertical movement
      if (startTile.coordinates.y !== endTile.coordinates.y
        && startTile.coordinates.x === endTile.coordinates.x) {
        // Potentially up or down
        direction = startTile.coordinates.y > endTile.coordinates.y
          ? DIRECTIONS.UP
          : DIRECTIONS.DOWN;
        if (gameState.actions[userIndex].includes(direction)) {
          movedStraightLine = await moveDirection(
            gameState, character.colour, startTile, endTile, direction, models,
          );
        }
      } else if (startTile.coordinates.x !== endTile.coordinates.x
        && startTile.coordinates.y === endTile.coordinates.y) {
        // Potentially left or right
        direction = startTile.coordinates.x > endTile.coordinates.x
          ? DIRECTIONS.LEFT
          : DIRECTIONS.RIGHT;
        if (gameState.actions[userIndex].includes(direction)) {
          movedStraightLine = await moveDirection(
            gameState, character.colour, startTile, endTile, direction, models,
          );
        }
      }

      if (movedStraightLine && !specialMovement) {
        if (endTile.type === TIME_TYPE && !endTile.used) {
          const rotateActions = rotateList(gameState.actions, 1);
          await updateEndTime(ObjectId(gameStateID), ObjectId(endTile._id), rotateActions, models);
        } else if (!gameState.allItemsClaimed) {
          await updateItemClaimed(ObjectId(gameStateID), endTile, character.colour, models);
          await checkCharactersOnTile(ObjectId(gameStateID), ITEM_TYPE, models);
        } else if (endTile.type === EXIT_TYPE
          && gameState.allItemsClaimed
          && !gameState.allCharactersEscaped) {
          await updateCharacterEscaped(ObjectId(gameStateID), endTile, character.colour, models);
          await checkCharactersOnTile(ObjectId(gameStateID), EXIT_TYPE, models);
        }
      }

      const { coordinates } = specialMovement || movedStraightLine ? endTile : startTile;
      // update to db
      const updatedGameState = await models.GameState.findOneAndUpdate({
        _id: ObjectId(gameStateID),
        'characters.colour': characterColour,
      },
      {
        $set: {
          'characters.$.coordinates': coordinates,
          'characters.$.locked': null,
        },
      },
      { returnOriginal: false });

      const updatedChar = _.find(updatedGameState.value.characters,
        char => char.colour === characterColour);

      pubsub.publish(CHARACTER_COORDINATES_UPDATED,
        { characterUpdated: updatedChar, gameStateID });

      return updatedChar;
    },
    searchAction: async (_parent, {
      gameStateID,
      userID,
      characterCoords,
    }, { models }) => {
      const gameState = await models.GameState
        .findOne({ _id: ObjectId(gameStateID) });
      const userIndex = _.findIndex(gameState.users, user => (user.uid === userID));

      if (userIndex === -1) throw Error('User does not exist in game');
      if (!gameState.actions[userIndex].includes(Action.SEARCH)) throw Error('User cannot perform the search action');

      const character = _.find(gameState.characters, char => (
        char.coordinates.x === characterCoords.x
        && char.coordinates.y === characterCoords.y
      ));
      const searchTile = await models.Tile
        .findOne({
          gameStateID: ObjectId(gameStateID),
          coordinates: characterCoords,
          type: SEARCH_TYPE,
          searched: false,
          colour: character.colour,
        });
      const nextMazeTile = _.find(gameState.mazeTiles, mt => !mt.cornerCoordinates);

      if (!searchTile || nextMazeTile === undefined) throw Error('Could not search for a new maze tile');

      const usedMazeTiles = _.reduce(gameState.mazeTiles, (array, mt) => {
        if (mt.cornerCoordinates) array.push(ObjectId(mt._id));
        return array;
      }, []);
      const searchTileDir = _.findIndex(searchTile.neighbours, neighbour => neighbour === null);

      const entryTile = await models.Tile.findOne({
        gameStateID: ObjectId(gameStateID),
        mazeTileID: nextMazeTile._id, // didn't cast to ObjectId
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
      let coord = null;
      switch (searchTileDir) {
        case DIRECTIONS.UP:
          coord = { x: searchTile.coordinates.x, y: searchTile.coordinates.y - 1 };
          break;
        case DIRECTIONS.LEFT:
          coord = { x: searchTile.coordinates.x - 1, y: searchTile.coordinates.y };
          break;
        case DIRECTIONS.DOWN:
          coord = { x: searchTile.coordinates.x, y: searchTile.coordinates.y + 1 };
          break;
        case DIRECTIONS.RIGHT:
          coord = { x: searchTile.coordinates.x + 1, y: searchTile.coordinates.y };
          break;
        default:
          break;
      }

      // update the cornerCoordinates of the nextMazeTile
      const coordSetMazeTile = await setCornerCoordinate(
        ObjectId(gameStateID),
        { x: coord.x, y: coord.y },
        entryTileDir,
        ObjectId(nextMazeTile._id),
        models,
      );

      // Set coordinates for tiles
      await setCoordinates(
        ObjectId(coordSetMazeTile._id),
        coordSetMazeTile.cornerCoordinates,
        orientation,
        models,
      );

      // Need to check the edge cases for adjacent mazetiles and update them
      await updateAdjacentMazeTiles(
        ObjectId(gameStateID),
        coordSetMazeTile.cornerCoordinates,
        ObjectId(coordSetMazeTile._id),
        usedMazeTiles,
        models,
      );
      const updatedGameState = await models.GameState.findOneAndUpdate({
        _id: ObjectId(gameStateID),
        'characters.colour': character.colour,
      },
      {
        $set: {
          'characters.$.locked': null,
        },
      },
      { returnOriginal: false });

      const mazeTile = _.find(updatedGameState.value.mazeTiles,
        mt => ObjectId(mt._id).equals(nextMazeTile._id));
      const updatedChar = _.find(updatedGameState.value.characters,
        char => char.colour === character.colour);
      pubsub.publish(CHARACTER_COORDINATES_UPDATED,
        { characterUpdated: updatedChar, gameStateID });
      pubsub.publish(MAZETILE_ADDED, { mazeTileAdded: mazeTile, gameStateID });
      return mazeTile;
    },
    lockCharacter: async (_parent, {
      gameStateID,
      userID,
      characterColour,
    }, { models }) => {
      const { characters } = await models.GameState.findOne({
        _id: ObjectId(gameStateID),
        'characters.colour': characterColour,
      });

      const character = _.find(characters, char => char.colour === characterColour);
      const hasAnotherLock = _.find(characters, char => char.locked === userID);
      if (hasAnotherLock > -1) return character;

      if (!character.locked) {
        character.locked = userID;
      } else if (character.locked === userID) {
        character.locked = null;
      } else {
        return character;
      }

      const updatedGameState = await models.GameState.findOneAndUpdate({
        _id: ObjectId(gameStateID),
        'characters.colour': characterColour,
      },
      {
        $set: {
          'characters.$.locked': character.locked,
        },
      },
      { returnOriginal: false });

      const updatedChar = _.find(updatedGameState.value.characters,
        char => char.colour === characterColour);

      pubsub.publish(CHARACTER_LOCK,
        { characterUpdated: updatedChar, gameStateID });

      return updatedChar;
    },
  },
};
