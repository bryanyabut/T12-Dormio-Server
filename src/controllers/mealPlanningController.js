const { prisma } = require('../config/db');
const { prismaGenerated } = require('../generated/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const SearchFilter = require('../utils/searchFilter');
const sendNotificationToDevice = require('../utils/sendNotificationToDevice');

// Get weekly meal plans for the STUDENT
// route: GET /api/meal-plans
const getAllMeals = asyncHandler(async (req, res) => {

    const searchFields = [
        'mealName',
        'description',
        'ingredients',
    ];

    const { where, skip, take, orderBy } = SearchFilter(req, searchFields);

    const allMeals = await prisma.mealItem.findMany({
        where,
        skip,
        take,
        orderBy,
    });

    res.status(200).json({ success: true, data: allMeals });
});

module.exports = {
    getAllMeals,
}