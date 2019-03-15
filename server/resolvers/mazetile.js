const { ObjectId } = require('mongoose').Types;

module.exports = {
  Query: {
    mazetile: async (_parent, { mazeTileID }, { models }) => (
      models.MazeTile.findOne({ _id: ObjectId(mazeTileID) })
    ),
    mazetiles: async (_parent, { gameStateID }, { models }) => models.MazeTile
      .find({ gameState: ObjectId(gameStateID) })
      .toArray(),
  },
};
