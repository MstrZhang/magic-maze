const mongoose = require('mongoose');

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });
const { ObjectId } = mongoose.Schema.Types;

// controls the state
const gameState = new mongoose.Schema({
  vortex_enabled: { type: Boolean, required: true },
  items_claimed: { type: Boolean, required: true },
  characters_escaped: { type: Boolean, required: true },
  unused_searches: [{ type: ObjectId, required: true }],
});

module.exports = {
  gameStateSchema: gameState,
  GameState: db.collection('GameState', gameState),
};
