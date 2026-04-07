const { prisma } = require('../config/db');
const asyncHandler = require("../middleware/asyncHandler");
const SearchFilter = require('../utils/searchFilter');

// GET all chores
// route: GET /api/chores
exports.getAllChores = asyncHandler(async (req, res) => {
    const fields = ['choreName', 'description', 'user.firstName', 'user.lastName'];
    
    const { where, skip, take, orderBy } = SearchFilter(req, fields);

    const chores = await prisma.choreAssignment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { 
            user: {
                include: { profile: true }
            } 
        }
    });

    const total = await prisma.choreAssignment.count({ where });

    res.status(200).json({
        success: true,
        message: 'Chores retrieved successfully',
        data: chores,
        meta: {
            total,
            page: parseInt(req.query.page) || 1,
            limit: take
        }
    });
});