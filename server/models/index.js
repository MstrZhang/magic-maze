const { Tile } = require('./tiles');
const { MazeTile } = require('./mazetile');
const { GameState } = require('./game');
const { Character } = require('./character');

module.exports = {
  ...Tile,
  ...MazeTile,
  ...GameState,
  ...Character,
};
