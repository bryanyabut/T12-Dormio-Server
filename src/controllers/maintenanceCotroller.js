const {prisma} = require('../config/db');
const { RequestStatus } = require('../generated/prisma');
const asyncHandler = require('../middleware/asyncHandler');

//get maintenance records ADMIN
const getMaintenanceR= asyncHandler(async (req, res, next) => {
    const studentRequests = await prisma.maintenanceRequest.findMany({
        include: { user: true }
    });

    res.status(200).json({ success: true, data: studentRequests });
});

//get maintenance record by id ADMIN
const getMaintenanceRById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const request = await prisma.maintenanceRequest.findUnique({
        where: { id: parseInt(id) },
        include: { user: true }
    });

    if(!request){
        res.status(404);
        return next(new Error('Maintenance request not found'));
    }

    res.status(200).json({ success: true, data: request });
});

// update maintenance record status ADMIN
const updateMaintenanceRStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const statusOptions = Object.values(RequestStatus);
    if(!status || !statusOptions.includes(status)){
        res.status(422);
        return next(new Error(`Status is required and must be one of: ${statusOptions.join(', ')}`));
    }

    const request = await prisma.maintenanceRequest.update({
        where: { id: parseInt(id) },
        data: { status }
    });

    if(!request){
        res.status(404);
        return next(new Error('Maintenance request not found'));
    }

    res.status(200).json({ success: true, data: request });
});

//create maintenance record STUDENT
const createMaintenanceR = asyncHandler(async (req, res, next) => {
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
            user: { 
                connect: 
                { 
                    id: req.user.userId 
                } 
            }
        }

    });
    res.status(201).json({ success: true, data: newRequest});
});

// update maintenance record status STUDENT
const updateMaintenanceR = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, urgency} = req.body

    const request = await prisma.maintenanceRequest.findUnique({
        where:{
            id: parseInt(id)
        }       
    });

    if(!request){
        res.status(404);
        return next(new Error('Maintenance request not found'))
    }

    if(request.userId !== req.user.id && req.user.role === 'STUDENT'){
        res.status(403);
        return next(new Error('Unauthorized to update this maintenance request'))
    }

    const updateRequest = await prisma.maintenanceRequest.update({
        where: { id: parseInt(id) },
        data: { 
            title,
            description,
            urgency
        }
    });

    res.status(200).json({ success: true, data: updateRequest})
});

//Delete maintenance record
const deleteMaintenanceR = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const request = await prisma.maintenanceRequest.delete({
        where: { id: parseInt(id) }
    });

    if(!request){
        res.status(404);
        return next(new Error('Maintenance request not found'));
    }
    res.status(200).json({ success: true, data: request });
});

module.exports = { 
    getMaintenanceR, 
    getMaintenanceRById, 
    createMaintenanceR, 
    updateMaintenanceRStatus, 
    deleteMaintenanceR, 
    updateMaintenanceR };