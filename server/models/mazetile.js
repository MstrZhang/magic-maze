const mongoose = require('mongoose');
const { coordinatesSchema } = require('./common');

const mazetile = new mongoose.Schema({
  _id: { type: String, required: true },
  orientation: { type: Number, default: 0, required: true },
  cornerCoordinates: { type: coordinatesSchema },
  spriteID: { type: Number, required: true },
});

module.exports = {
  mazeTileSchema: mazetile,
};
