const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAllMeals } = require('../controllers/mealPlanningController');

router.get('/', authenticateToken, getAllMeals);

module.exports = router;