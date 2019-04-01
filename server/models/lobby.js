const mongoose = require('mongoose');
const { userSchema } = require('./user');

const { ObjectId } = mongoose.Schema.Types;

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

const lobby = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  users: [{ type: userSchema }],
});

module.exports = {
  Lobby: db.collection('Lobby', lobby),
};
