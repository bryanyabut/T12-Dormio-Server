const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { getAllChores } = require('../controllers/choreController');

router.get('/', authenticateToken, getAllChores);

module.exports = router;