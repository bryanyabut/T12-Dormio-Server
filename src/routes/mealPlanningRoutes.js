const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { getAllMealPlans, 
    getMealPlanDetails, 
    getMealsByDay,
    subscribeToMealPlan,
    getActiveMealPlan,
    updateMealTemplate,
    getAllMealItems
} = require('../controllers/mealPlanningController');


router.get('/meal-items', authenticateToken, requireAdmin, getAllMealItems);
router.get('/my-plan', authenticateToken, getActiveMealPlan);

router.post('/subscribe', authenticateToken, subscribeToMealPlan);
router.post('/templates', authenticateToken, requireAdmin, updateMealTemplate);

router.get('/', authenticateToken, getAllMealPlans);
router.get('/:mealPlanTypeId', authenticateToken, getMealPlanDetails);
router.get('/:mealPlanTypeId/day/:dayOfWeek', authenticateToken, getMealsByDay);


module.exports = router;