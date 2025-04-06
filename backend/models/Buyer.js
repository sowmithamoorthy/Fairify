const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  userId: String,
  passkey: String,
});

module.exports = mongoose.model('Buyer', buyerSchema);
