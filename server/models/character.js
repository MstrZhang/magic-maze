const mongoose = require('mongoose');
const { coordinatesSchema } = require('./common');

const character = new mongoose.Schema({
  colour: { type: String, required: true },
  itemClaimed: { type: Boolean, required: true },
  characterEscaped: { type: Boolean, required: true },
  coordinates: { type: coordinatesSchema, required: true },
});

module.exports = {
  characterSchema: character,
};
