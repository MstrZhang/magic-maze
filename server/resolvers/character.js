const _ = require('lodash');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const logger = require('../common/logger');
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
    'character.colour': characterColour,
  },
  {
    $set: {
      'character.$.itemClaimed': endTile.type === ITEM_TYPE,
    },
  });
};

const updateCharacterEscaped = async (gameStateID, endTile, characterColour, models) => {
  await models.GameState.updateOne({
    _id: gameStateID,
    'character.colour': characterColour,
  },
  {
    $set: {
      'character.$.itemClaimed': endTile.type === EXIT_TYPE,
    },
  });
};

const rotateList = (array, steps) => (
  _.concat(_.drop(array, steps), _.take(array, array.length - steps))
);

const updateTileOrientation = async (nextMazeTileID, orientation, models) => {
  await models.MazeTile.updateOne({ _id: nextMazeTileID }, { $set: { orientation } });
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
        case 0:
          await setCoordinates(neighbour, x, y - 1, models);
          break;
        case 1:
          await setCoordinates(neighbour, x - 1, y, models);
          break;
        case 2:
          await setCoordinates(neighbour, x, y + 1, models);
          break;
        case 3:
          await setCoordinates(neighbour, x + 1, y, models);
          break;
        default:
          break;
      }
    }));
  }
};

const manhattanDistance = (coord1, coord2) => (
  Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y)
);

const updateAdjacentMazeTiles = async (nextMazeTile, models) => {
  // given new MazeTile to add do the following
  // for each search in newMazeTile, check if there is an adjacent MazeTile using unusedSearches
  // if there is, update that mazetile's null to newmazeTile's search tile and vice versa. remove
  // that tile from unusedSearches if not, add this newMazeTile's seaerch tile to the list of new
  // searchTiles

  let found = false;
  // assuming coordinates are set for nextMazeTile
  const searchTiles = await models.Tile.find({
    mazeTile: ObjectId(nextMazeTile._id),
    type: SEARCH_TYPE,
  }).toArray();

  const gameState = await models.GameState
    .findOne({ _id: ObjectId(nextMazeTile.gameState) });

  let newUnusedSearches = [];
  const uncheckedSearchTiles = _.clone(searchTiles.neighbours); // these lads have no coordinates

  await Promise.all(gameState.unusedSearches.forEach(async (unusedTile) => {
    await Promise.all(searchTiles.forEach(async (searchTile, i) => {
      // found an adjacent node
      if (manhattanDistance(unusedTile.coordinates, searchTile) === 1
        && uncheckedSearchTiles.has(searchTile)) {
        found = true;
        uncheckedSearchTiles.splice(i, 1);

        // update new search tile's neighbour
        const adjacentTileIdx = _.findIndex(searchTile.neighbours, neighbour => neighbour === null);
        searchTile.neighbours[adjacentTileIdx] = unusedTile._id;
        await models.Tile
          .updateOne({ _id: searchTile._id }, {
            $set: { neighbours: searchTile.neighbours, searched: true },
          });

        // update (existing) adjacent maze tile's neighbour
        const unusedTileObj = await models.Tile.findOne({ _id: unusedTile._id });
        const adjUnusedTileIdx = _.findIndex(
          unusedTileObj.neighbours,
          neighbour => neighbour === null,
        );
        unusedTileObj.neighbours[adjUnusedTileIdx] = searchTile._id;

        await models.Tile.updateOne({ _id: unusedTileObj._id }, {
          $set: { neighbours: unusedTileObj.neighbours, searched: true },
        });
      }
    }));

    if (!found) {
      newUnusedSearches.push(unusedTile);
    } else {
      found = false;
    }
  }));

  // update adjacent maze tiles
  newUnusedSearches = _.concat(newUnusedSearches, uncheckedSearchTiles);

  await models.GameState.updateOne({ _id: gameState._id }, {
    $set: { unusedSearches: newUnusedSearches },
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
      return models.GameState.findOne({ _id: ObjectId(gameStateID) });
    },
    searchAction: async (_parent, { gameStateID, characterID, searchTileID }, { models }) => {
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

      const character = await models.Character
        .findOne({ _id: characterID, gameState: ObjectId(gameStateID) });
      const gameState = await models.GameState
        .findOne({ gameState: ObjectId(gameStateID) });
      const searchTile = await models.Tile
        .findOne({ _id: searchTileID, gameState: ObjectId(gameStateID) });

      if (searchTile.type !== SEARCH_TYPE
        || character.colour !== searchTile.colour
        || gameState.unusedMazeTiles.length === 0) {
        return gameState;
      }
      // pop next mazeTile
      const nextMazeTile = _.head(gameState.unusedMazeTiles);
      gameState.unusedMazeTiles = _.drop(gameState.unusedMazeTiles);

      const searchTileDir = _.findIndex(searchTile.neighbours, neighbour => neighbour === null);

      const entryTile = await models.Tile.findOne({
        gameState: ObjectId(gameStateID),
        mazeTile: ObjectId(nextMazeTile._id),
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
      await updateTileOrientation(ObjectId(nextMazeTile._id), orientation, models);

      // Set coordinates for tiles
      await setCoordinates(entryTile, searchTile.coordinates.x, searchTile.coordinates.y, models);

      // Need to check the edge cases for adjacent mazetiles and update them
      await updateAdjacentMazeTiles(nextMazeTile, models);


      return gameState;
    },
  },
};
