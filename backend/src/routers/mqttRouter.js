const express = require('express');
const { sendAcknowledgment } = require('../controllers/mqttController.js');

const router = express.Router();

router.post('/', sendAcknowledgment);

module.exports = router;
