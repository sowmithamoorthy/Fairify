const mongoose = require('mongoose');

const verifiedUserSchema = new mongoose.Schema({
  role: String, // "buyer" or "seller"
  name: String,
  email: String,
  userId: String,
  passkey: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerifiedUser', verifiedUserSchema);
