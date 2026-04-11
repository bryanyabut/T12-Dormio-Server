const express = require('express');
const router = express.Router();
const { updateDeviceToken } = require('../controllers/user');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protectd route for updating device token
router.post('/device-token', authenticateToken, updateDeviceToken);

module.exports = router;
