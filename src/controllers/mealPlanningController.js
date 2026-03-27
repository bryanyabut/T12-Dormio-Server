const { prisma } = require('../config/db');
const { prismaGenerated } = require('../generated/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const searchFilter = require('../utils/searchFilter');
const sendNotificationToDevice = require('../utils/sendNotificationToDevice');


// Get all meal plans
// route: GET /api/meal-plans
const getAllMealPlans = asyncHandler(async (req, res) => {
    const plans = await prisma.mealPlanType.findMany({
        select: {
            id: true,
            name: true,
            description: true,
        }
    });

    res.status(200).json({ success: true, data: plans });
});


// Get weekly meal plans for the STUDENT
// route: GET /api/meal-plans/:mealPlanTypeId
const getMealPlanDetails = asyncHandler(async (req, res) => {
    const { mealPlanTypeId } = req.params;

    if (!mealPlanTypeId) {
        return res.status(400).json({ success: false, message: 'mealPlanTypeId is required' });
    }

    // Fetch all templates of meal items
    const templates = await prisma.mealPlanTemplate.findMany({
        where: { mealPlanTypeId: Number(mealPlanTypeId) },
        include: {
            mealItem: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            }
        },
        orderBy: [
            { dayOfWeek: 'asc' },
            { mealType: 'asc' }
        ]
    });

    const grouped = {};
    templates.forEach(template => {
        const day = template.dayOfWeek;

        if (!grouped[day]){
            grouped[day] = [];
        }

        grouped[day].push({
            mealType: template.mealType,
            id: template.mealItem.id,
            name: template.mealItem.name,
            description: template.mealItem.description
        });
    });

    const converted = Object.keys(grouped).map(day => ({
        day,
        meals: grouped[day]
    }));

    res.status(200).json({ success: true, data: converted });
});

// get meal plan by day
// route: GET /api/meal-plans/:mealPlanTypeId/day/:dayOfWeek
const getMealsByDay = asyncHandler(async (req, res) => {
    const { mealPlanTypeId, dayOfWeek } = req.params;

    if (!mealPlanTypeId || !dayOfWeek) {
        return res.status(400).json({ success: false, message: 'mealPlanTypeId and dayOfWeek are required' });
    }

    const meal = await prisma.mealPlanTemplate.findMany({
        where: {
            mealPlanTypeId: Number(mealPlanTypeId),
            dayOfWeek
        },
        include: {
            mealItem: {
                id: true,
                name: true,
                description: true,
                mealItemIngredients: {
                    include: {
                        ingredient: true
                    }
                }
            }
        },
        orderBy: { mealType: 'asc' }
    });

    const formatted = meal.map(m => ({
        mealType: m.mealType,
        id: m.mealItem.id,
        name: m.mealItem.name,
        description: m.mealItem.description,
        ingredients: m.mealItem.mealItemIngredients.map(mi => ({
            id: mi.ingredient.id,
            name: mi.ingredient.name,
            description: mi.ingredient.description
        }))
    }));

    res.status(200).json({ success: true, data: formatted });
});


module.exports = {
    getMealPlanDetails,
    getAllMealPlans,
    getMealsByDay
}