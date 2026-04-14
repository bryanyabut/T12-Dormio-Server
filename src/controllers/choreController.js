const { prisma } = require('../config/db');
const asyncHandler = require("../middleware/asyncHandler");
const SearchFilter = require('../utils/searchFilter');

// GET all chores
// route: GET /api/chores/dashboard
exports.getChoreDashboard = asyncHandler(async (req, res) => {

    console.log("User from middleware: ", req.user);

    const userId = req.user?.userId;

    if (!userId) {
        console.error("DEBUG: req.user is:", req.user);
        return res.status(401).json({ 
            success: false, 
            message: "User ID not found. Authentication context missing." 
        });
    }

    const dashboardData = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
            firstName: true,
            choreAssignments: {
                include: {
                    chore: {
                        include: {
                            choreAssignments: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!dashboardData) {
        return res.status(404).json({ message: 'User not found' });
    }

    const chores = dashboardData.choreAssignments.map((assignment) => {
        const chore = assignment.chore;
        const choreDate = new Date(chore.dueDate);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
    
        return {
            id: chore.id,
            choreName: chore.choreName,
            description: chore.description,
            dueDate: chore.dueDate,
            status: chore.status,
            isDueToday: choreDate.toDateString() === todayDate.toDateString(),
            isOverdue: choreDate < todayDate && chore.status !== 'COMPLETED',
            assignedUsers: chore.choreAssignments.map(ca => {
                const fInitial = ca.user.firstName ? ca.user.firstName[0] : '?';
                const lInitial = ca.user.lastName ? ca.user.lastName[0] : '?';
            
                return {
                    id: ca.user.id,
                    initials: `${fInitial}${lInitial}`.toUpperCase()
                };
            })
        };
    });

    const totalChores = chores.length;
    const completedChores = chores.filter(chore => chore.status === 'COMPLETED').length;
    const choresLeft = totalChores - completedChores;

    res.status(200).json({
        success: true,
        data: {
            greeting: `Good day, ${dashboardData.firstName}!`,
            todayChores: chores,
            stats: {
                choresLeft,
                totalChores,
                completedChores,
                progressMessage: `${completedChores} of ${totalChores} Chores Completed`,
                percentComplete: totalChores > 0 ? (completedChores / totalChores) * 100 : 0
            },
        }
    });

});


// POST create a new chore
// route: POST /api/v1/chores
exports.createChore = asyncHandler(async (req, res) => {
    const { name, description, dueDate, assignedUserIds } = req.body;

    if (!name || !dueDate || !assignedUserIds || assignedUserIds.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide name, dueDate, and at least one assigned user." 
        });
    }

    const newChore = await prisma.chore.create({
        data: {
            choreName: name, 
            description: description,
            dueDate: new Date(dueDate),
            status: 'PENDING',
            choreAssignments: {
                create: assignedUserIds.map(userId => ({
                    userId: parseInt(userId)
                }))
            }
        },
        include: {
            choreAssignments: true
        }
    });

    res.status(201).json({
        success: true,
        data: newChore
    });
});


// GET all housemates/residents for assignment (Filtered by Building and Unit)
// route: GET /api/v1/chores/housemates
exports.getHousemates = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const currentUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { 
            addressId: true,
            address: {
                select: { unitNumber: true }
            }
        }
    });

    if (!currentUser || !currentUser.addressId) {
        return res.status(400).json({ 
            success: false, 
            message: "User does not have an assigned address." 
        });
    }

    const users = await prisma.user.findMany({
        where: {
            addressId: currentUser.addressId,
            address: {
                unitNumber: currentUser.address.unitNumber
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true
        },
        orderBy: { firstName: 'asc' }
    });
    
    const housemates = users.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName, 
    initials: `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

    }));

    res.status(200).json({
        success: true,
        data: housemates
    });
});


// PATCH update chore status (mark as complete)
// route: PATCH /api/v1/chores/:id/complete
exports.completeChore = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const chore = await prisma.chore.findUnique({
        where: { id: parseInt(id) },
        include: { choreAssignments: true }
    });

    if (!chore) {
        res.status(404);
        return next(new Error("Chore not found"));
    }

    const isAssigned = chore.choreAssignments.some(a => a.userId === userId);
    if (!isAssigned && req.user.role !== 'ADMIN') {
        res.status(403);
        return next(new Error("You are not assigned to this chore"));
    }

    const updatedChore = await prisma.chore.update({
        where: { id: parseInt(id) },
        data: {
            status: "COMPLETED",
            completedByUserId: userId,
            completedAt: new Date(),
        },
    });

    res.status(200).json({
        success: true,
        message: "Chore marked as completed",
        data: updatedChore
    });
});

// PUT update chore details
// route: PUT /api/v1/chores/:id
exports.updateChore = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, dueDate, assignedUserIds } = req.body;

    const chore = await prisma.chore.findUnique({
        where: { id: parseInt(id) },
        include: { choreAssignments: true }
    });

    if (!chore) {
        res.status(404);
        return next(new Error("Chore not found"));
    }

    const isAssigned = chore.choreAssignments.some(a => a.userId === req.user.userId);
    
    if (!isAssigned && req.user.role !== 'ADMIN') {
        res.status(403);
        return next(new Error("You do not have permission to edit this chore"));
    }

    const updatedChore = await prisma.chore.update({
        where: { id: parseInt(id) },
        data: {
            choreName: name,
            description: description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
  
            choreAssignments: assignedUserIds ? {
                deleteMany: {},
                create: assignedUserIds.map(userId => ({
                    userId: parseInt(userId)
                }))
            } : undefined
        },
        include: {
            choreAssignments: true
        }
    });

    res.status(200).json({
        success: true,
        message: "Chore updated successfully",
        data: updatedChore
    });
});

// GET a single chore by ID
// route: GET /api/v1/chores/:id
exports.getChoreById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const chore = await prisma.chore.findUnique({
        where: { id: parseInt(id) },
        include: {
            choreAssignments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });

    if (!chore) {
        res.status(404);
        return next(new Error("Chore not found"));
    }

    const formattedChore = {
        id: chore.id,
        choreName: chore.choreName,
        description: chore.description,
        dueDate: chore.dueDate,
        status: chore.status,
        assignedUsers: chore.choreAssignments.map(ca => ({
            id: ca.user.id,
            initials: `${ca.user.firstName?.[0] || ''}${ca.user.lastName?.[0] || ''}`.toUpperCase()
        }))
    };

    res.status(200).json({
        success: true,
        data: formattedChore
    });
});