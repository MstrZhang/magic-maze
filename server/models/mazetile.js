const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

const mazetile = new mongoose.Schema();
mazetile.add({
  _id: { type: String, required: true },
  orientation: { type: Number, default: 0, required: true },
  gameState: { type: ObjectId, required: true },
  adjacentMazeTiles: [mazetile],
});

module.exports = {
  mazeTileSchema: mazetile,
  MazeTile: db.collection('MazeTile', mazetile),
};
