const {prisma} = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

//get maintenance records
const getMaintenanceRequest= asyncHandler(async (req, res, next) => {
    const studentRequests = await prisma.maintenanceRequest.findMany({
        include: { user: true }
    });

    if(!studentRequests){
        res.status(404);
        return next(new Error('No maintenance requests found'));
    }

    res.status(200).json({ success: true, data: studentRequests });
});

//create maintenance record
const createMaintenanceRequest = asyncHandler(async (req, res, next) => {
    const { title, description, urgency } = req.body;

    if(!title || !description || !urgency){
        res.status(422);
        return next(new Error('Title, description, and urgency are required'));
    }
    const newRequest = await prisma.maintenanceRequest.create({
        data: {
            title,
            description,
            urgency,
            // userId: req.user.id
            userId: 1 //temporary
        }

    });
    res.status(201).json({ success: true, data: newRequest});
});

module.exports = { getMaintenanceRequest, createMaintenanceRequest };