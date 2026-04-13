const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { 
    getChoreDashboard,
    createChore,
    getHousemates
 } = require('../controllers/choreController');

router.get('/dashboard', authenticateToken, getChoreDashboard);
router.get('/housemates', authenticateToken, getHousemates);
router.post('/', authenticateToken, createChore);

module.exports = router;