const mongoose = require('mongoose');
const { coordinatesSchema } = require('./common');

const { ObjectId } = mongoose.Schema.Types;

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

const character = new mongoose.Schema({
  colour: { type: String, required: true },
  itemClaimed: { type: Boolean, required: true },
  characterEscaped: { type: Boolean, required: true },
  gameState: { type: ObjectId, required: true },
  coordinates: { type: coordinatesSchema, required: true },
});

module.exports = {
  characterSchema: character,
  Character: db.collection('Character', character),
};
