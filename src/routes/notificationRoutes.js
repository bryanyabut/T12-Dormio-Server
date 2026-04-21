const express = require('express');
const router = express.Router();
const { getMyNotifications } = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getMyNotifications);

module.exports = router;