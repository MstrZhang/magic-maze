const _ = require('lodash');
const tiles = require('./tiles');
const game = require('./game');
const character = require('./character');

module.exports = _.merge({},
  tiles,
  character,
  game);
