const { concatenateTypeDefs } = require('apollo-server-express');
const common = require('./common');
const tiles = require('./tiles');
const character = require('./character');
const game = require('./game');
const mazetile = require('./mazetile');

const query = `
  type Query {
    _empty: String
  }
`;

module.exports = concatenateTypeDefs([
  query,
  common,
  tiles,
  character,
  game,
  mazetile,
]);
