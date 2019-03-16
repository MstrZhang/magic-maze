const mongoose = require('mongoose');
const { coordinatesSchema } = require('./common');

const { ObjectId } = mongoose.Schema.Types;

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

const tile = new mongoose.Schema({
  _id: { type: String, required: true },
  mazeTileID: { type: ObjectId, required: true },
  gameStateID: { type: ObjectId, required: true },
  coordinates: { type: coordinatesSchema },
  type: { type: String, required: true },
  neighbours: [{ type: ObjectId, required: true }],

  // special tile attributes
  colour: { type: String },
  used: { type: Boolean }, // Time tiles
  searched: { type: Boolean }, // Search tiles
});

module.exports = {
  tileSchema: tile,
  Tile: db.collection('Tile', tile),
};
