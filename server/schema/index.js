const { makeExecutableSchema } = require('apollo-server-express');
const logger = require('../utils/logger');
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

module.exports = makeExecutableSchema({
  typeDefs: [
    query,
    common,
    tiles,
    character,
    game,
    mazetile,
  ],
  logger: { log: e => logger.debug(e) },
});
