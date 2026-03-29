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
                select: { 
                    id: true,
                    name: true,
                    description: true,
                    mealItemIngredients: {
                        include: {
                            ingredient: true
                        }
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

// STUDENT subcribes to a meal plan
// route: POST /api/meal-plans/subscribe
const subscribeToMealPlan = asyncHandler(async (req, res) => {
    const { mealPlanTypeId } = req.body;
    const userId = req.user.userId;

    if (!mealPlanTypeId || isNaN(Number(mealPlanTypeId))) {
        return res.status(400).json({ success: false, message: 'mealPlanTypeId is required' });
    }

    const planExists = await prisma.mealPlanType.findUnique({
        where: { id: Number(mealPlanTypeId) }
    });

    if (!planExists) {
        return res.status(404).json({ success: false, message: 'Meal plan not found' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 4);

    console.log("FULL REQ.USER OBJECT:", req.user);
    console.log("EXTRACTED USER ID:", req.user?.id);

    const existing = await prisma.userMealPlan.findFirst({
        where: { userId: Number(userId) }
    });

    const subscription = await prisma.userMealPlan.upsert({
        where: {
            id: existing ? existing.id : 0
        },
        update: {
            mealPlanTypeId: Number(mealPlanTypeId),
            startDate,
            endDate
        },
        create: {
            userId: Number(userId),
            mealPlanTypeId: Number(mealPlanTypeId),
            startDate,
            endDate
        }
    });

    res.status(201).json({ 
        success: true,
        message: `Successfully subscribed to meal plan ${planExists.name}`, 
        data: subscription });
});


module.exports = {
    getMealPlanDetails,
    getAllMealPlans,
    getMealsByDay,
    subscribeToMealPlan
}