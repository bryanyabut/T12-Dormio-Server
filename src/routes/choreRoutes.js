const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { 
    getChoreDashboard,
    createChore,
    getHousemates,
    completeChore,
 } = require('../controllers/choreController');

router.get('/dashboard', authenticateToken, getChoreDashboard);
router.get('/housemates', authenticateToken, getHousemates);
router.post('/', authenticateToken, createChore);
router.patch('/:id/complete', authenticateToken, completeChore);

module.exports = router;