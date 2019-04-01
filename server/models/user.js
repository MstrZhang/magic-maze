const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const db = mongoose.createConnection(process.env.MONGODB_DEV, { useNewUrlParser: true });

const user = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  uid: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = {
  userSchema: user,
  User: db.collection('User', user),
};
