const mongoose = require('mongoose');

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });
const { ObjectId } = mongoose.Schema.Types;

// controls the state
const gameState = new mongoose.Schema({
  _id: { type: String, required: true },
  vortexEnabled: { type: Boolean, required: true },
  allItemsClaimed: { type: Boolean, required: true },
  allCharactersEscaped: { type: Boolean, required: true },
  unusedSearches: [{ type: ObjectId, required: true }],
  unusedMazeTiles: [{ type: ObjectId, required: true }],
});

module.exports = {
  gameStateSchema: gameState,
  GameState: db.collection('GameState', gameState),
};
