const mongoose = require('mongoose');
const { gameStateSchema } = require('./game');

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

const mazetile = new mongoose.Schema();
mazetile.add({
  orientation: { type: Number, default: 0, required: true },
  gameState: { type: gameStateSchema, required: true },
  adjacentMazeTiles: [mazetile],
});

module.exports = {
  mazeTileSchema: mazetile,
  MazeTile: db.collection('MazeTile', mazetile),
};
