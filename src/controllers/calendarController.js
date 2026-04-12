const asyncHandler = require('../middleware/asyncHandler');
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// @desc    Get all events for the logged-in user
// @route   GET /api/v1/calendar
exports.getEvents = asyncHandler(async (req, res) => {
    const events = await prisma.event.findMany({
        where: {
            userId: Number(req.user.id || req.user.userId)
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});

// @route   POST /api/v1/calendar
exports.createEvent = asyncHandler(async (req, res) => {
    const userIdValue = req.user.id || req.user.userId || (req.user.user && req.user.user.id);

    if (!userIdValue) {
        return res.status(401).json({
            success: false,
            message: "User ID not found in token."
        });
    }

    const event = await prisma.event.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            startTime: new Date(req.body.startTime),
            endTime: new Date(req.body.endTime),
            category: req.body.category,
            userId: Number(userIdValue), 
            relatedId: req.body.relatedId || null
        }
    });

    res.status(201).json({
        success: true,
        data: event
    });
});

// @route   PUT /api/v1/calendar/:id
exports.updateEvent = asyncHandler(async (req, res) => {
    let event = await prisma.event.findUnique({
        where: { id: req.params.id }
    });

    if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.userId !== Number(req.user.id || req.user.userId)) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    event = await prisma.event.update({
        where: { id: req.params.id },
        data: {
            ...req.body,
            startTime: req.body.startTime ? new Date(req.body.startTime) : event.startTime,
            endTime: req.body.endTime ? new Date(req.body.endTime) : event.endTime,
        }
    });

    res.status(200).json({ success: true, data: event });
});

// @route   DELETE /api/v1/calendar/:id
exports.deleteEvent = asyncHandler(async (req, res) => {
    const event = await prisma.event.findUnique({
        where: { id: req.params.id }
    });

    if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.userId !== Number(req.user.id || req.user.userId)) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await prisma.event.delete({
        where: { id: req.params.id }
    });

    res.status(200).json({ success: true, data: {} });
});