const _ = require('lodash');
const tiles = require('./tiles');
const game = require('./game');
const character = require('./character');

module.exports = _.merge({},
  {
    Orientation: {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
    },
  },
  tiles,
  character,
  game);
