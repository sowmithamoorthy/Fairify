const Buyer = require('../models/Buyer');
const VerifiedUser = require('../models/VerifiedUser');
const { sendVerificationEmail } = require('../utils/emailService');
const crypto = require('crypto');

exports.signupBuyer = async (req, res) => {
  const { name, email, password } = req.body;

  const userId = crypto.randomBytes(4).toString('hex');
  const passkey = crypto.randomBytes(32).toString('hex');

  const buyer = new Buyer({ name, email, password, userId, passkey });
  await buyer.save();

  const verified = new VerifiedUser({
    role: 'buyer', name, email, userId, passkey,
  });
  await verified.save();

  await sendVerificationEmail(email, userId, passkey);

  res.status(201).json({ message: 'Buyer signed up and verified' });
};
