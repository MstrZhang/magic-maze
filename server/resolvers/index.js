const _ = require('lodash');
const tiles = require('./tiles');

_.merge(module.exports,
  {
    Orientation: {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
    },
  },
  {
    Query: {
    },
  },
  tiles);
