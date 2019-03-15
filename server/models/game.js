const mongoose = require('mongoose');
const { mazeTileSchema } = require('./mazetile');
const { characterSchema }  = require('./character');

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

// controls the state
const gameState = new mongoose.Schema({
  _id: { type: String, required: true },
  vortexEnabled: { type: Boolean, required: true },
  allItemsClaimed: { type: Boolean, required: true },
  allCharactersEscaped: { type: Boolean, required: true },
  mazeTiles: [{ type: mazeTileSchema, required: true }],
  characters: [{ type: characterSchema, required: true }],
});

module.exports = {
  gameStateSchema: gameState,
  GameState: db.collection('GameState', gameState),
};
