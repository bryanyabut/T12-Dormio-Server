const asyncHandler = require('../middleware/asyncHandler');
const { prisma } = require('../config/db');

// @desc    Get all schedules for the logged-in user
// @route   GET /api/v1/calendar
exports.getEvents = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const where = { userId };
    if (startDate || endDate) {
        where.startTime = {};
        if (startDate) where.startTime.gte = new Date(startDate);
        if (endDate) where.startTime.lte = new Date(endDate);
    }

    const schedules = await prisma.schedule.findMany({
        where,
        orderBy: { startTime: 'asc' },
    });

    res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules,
    });
});

// @route   POST /api/v1/calendar
exports.createEvent = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { title, type, description, startTime, endTime, location, courseCode, section } = req.body;

    const schedule = await prisma.schedule.create({
        data: {
            userId,
            title,
            type,
            description: description || null,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            location: location || null,
            courseCode: courseCode || null,
            section: section || null,
        },
    });

    res.status(201).json({
        success: true,
        data: schedule,
    });
});

// @route   PUT /api/v1/calendar/:id
exports.updateEvent = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const id = parseInt(req.params.id);
    const { title, type, description, startTime, endTime, location, courseCode, section } = req.body;

    const existing = await prisma.schedule.findFirst({ where: { id, userId } });

    if (!existing) {
        return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }

    const schedule = await prisma.schedule.update({
        where: { id },
        data: {
            ...(title && { title }),
            ...(type && { type }),
            ...(description !== undefined && { description }),
            ...(startTime && { startTime: new Date(startTime) }),
            ...(endTime && { endTime: new Date(endTime) }),
            ...(location !== undefined && { location }),
            ...(courseCode !== undefined && { courseCode }),
            ...(section !== undefined && { section }),
        },
    });

    res.status(200).json({ success: true, data: schedule });
});

// @route   DELETE /api/v1/calendar/:id
exports.deleteEvent = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const id = parseInt(req.params.id);

    const existing = await prisma.schedule.findFirst({ where: { id, userId } });

    if (!existing) {
        return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }

    await prisma.schedule.delete({ where: { id } });

    res.status(200).json({ success: true, data: {} });
});