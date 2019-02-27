const { makeExecutableSchema } = require('apollo-server-express');
const common = require('./common');
const tiles = require('./tiles');
const character = require('./character');

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
  ],
  inheritResolversFromInterfaces: true,
  resolvers: {},
});
