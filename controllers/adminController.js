const Seller = require('../models/Seller');
const VerifiedUser = require('../models/VerifiedUser');
const { sendVerificationEmail } = require('../utils/emailService');
const crypto = require('crypto');

exports.verifySeller = async (req, res) => {
  try {
    const { email } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    if (seller.isVerified) {
      return res.status(400).json({ message: 'Seller already verified' });
    }

    const existingVerified = await VerifiedUser.findOne({ email });
    if (existingVerified) {
      return res.status(400).json({ message: 'Seller already verified in VerifiedUser collection' });
    }

    const userId = crypto.randomBytes(4).toString('hex');
    const passkey = crypto.randomBytes(32).toString('hex');

    // Mark seller as verified
    seller.isVerified = true;
    await seller.save();

    // Add to VerifiedUser collection
    const verified = new VerifiedUser({
      role: 'seller',
      name: seller.name,
      email: seller.email,
      userId,
      passkey,
    });
    await verified.save();

    // Send passkey email
    await sendVerificationEmail(seller.email, userId, passkey);

    res.status(200).json({ message: 'Seller verified and email sent.' });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
};
