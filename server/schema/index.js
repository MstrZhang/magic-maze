const { makeExecutableSchema } = require('apollo-server-express');
const common = require('./common');
const tiles = require('./tiles');
const character = require('./character');
const game = require('./game');
const mazetile = require('./mazetile');

const Query = `
  type Query {
    _empty: String
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [
    Query,
    common,
    tiles,
    character,
    game,
    mazetile,
  ],
  inheritResolversFromInterfaces: true,
  resolvers: {},
});
