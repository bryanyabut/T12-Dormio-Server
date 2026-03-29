const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAllMealPlans, 
    getMealPlanDetails, 
    getMealsByDay,
    subscribeToMealPlan
} = require('../controllers/mealPlanningController');

router.get('/', authenticateToken, getAllMealPlans);
router.get('/:mealPlanTypeId', authenticateToken, getMealPlanDetails);
router.get('/:mealPlanTypeId/day/:dayOfWeek', authenticateToken, getMealsByDay);
router.post('/subscribe', authenticateToken, subscribeToMealPlan);

module.exports = router;