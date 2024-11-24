const express = require('express');
const { generateTOTP } = require('../controllers/totpController.js');

const router = express.Router();

router.get('/', generateTOTP);

module.exports = router;
