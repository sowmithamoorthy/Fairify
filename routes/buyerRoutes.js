const express = require('express');
const { signupBuyer } = require('../controllers/buyerController');

const router = express.Router();
router.post('/signup', signupBuyer);

module.exports = router;
