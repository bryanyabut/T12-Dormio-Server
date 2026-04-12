const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { getChoreDashboard } = require('../controllers/choreController');

router.get('/dashboard', authenticateToken, getChoreDashboard);

module.exports = router;