const _ = require('lodash');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const logger = require('../common/logger');
const {
  WALL_TYPE,
  SEARCH_TYPE,
  MAZETILE_TILE_CONFIGS,
  CHARACTER_COLOR_CONFIG,
  CHARACTER_COORDINATES_CONFIG,
} = require('../common/consts');

module.exports = {
  Query: {
    character: async (_parent, { characterID }, { models }) => models.Character
      .findOne({ _id: ObjectId(characterID) }),
    characters: async (_parent, { gameStateID }, { models }) => models.Character
      .find({ gameState: ObjectId(gameStateID) })
      .toArray(),
  },
  Mutation: {
    moveCharacter: async (_parent, args, { models }) => {
      /**
       * Thinking about having a switch case here or something to
       * determine which action the character performed
       * Actions that can happen:
       * Search - Pop from unused maze tile and DFS coordinates
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
    },
  },
};
