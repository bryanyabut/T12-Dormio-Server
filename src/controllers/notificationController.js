const { prisma } = require('../config/db');
const asyncHandler = require("../middleware/asyncHandler");

// GET all notifications for the logged-in user
// route: GET /api/v1/notifications
exports.getMyNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    res.status(200).json({
        success: true,
        data: notifications
    });
});