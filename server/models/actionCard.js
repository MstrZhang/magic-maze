const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

// controls the state
const actionCard = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  actions: [{ type: Number, required: true }],
  playerCount: [{ type: Number, required: true }],
});

module.exports = {
  actionCardSchema: actionCard,
  ActionCard: db.collection('ActionCard', actionCard),
};
