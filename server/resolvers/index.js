const _ = require('lodash');
const tiles = require('./tiles');
const mazetile = require('./mazetile');
const game = require('./game');

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
  mazetile,
  game);
