const express = require('express');
const { verifySeller } = require('../controllers/adminController');

const router = express.Router();
router.post('/verify-seller', verifySeller);

module.exports = router;
