const _ = require('lodash');
const tiles = require('./tiles');
const game = require('./game');
const character = require('./character');
const lobby = require('./lobby');
const actionCard = require('./actionCard');

module.exports = _.merge(
  {},
  tiles,
  character,
  game,
  lobby,
  actionCard,
);
