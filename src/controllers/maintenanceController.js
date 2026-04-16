const { prisma } = require("../config/db");
const { RequestStatus } = require("../generated/prisma");
const asyncHandler = require("../middleware/asyncHandler");
const SearchFilter = require("../utils/searchFilter");
const sendNotificationToDevice = require("../utils/sendNotificationToDevice");

//get maintenance records ADMIN
const getMaintenanceR = asyncHandler(async (req, res, next) => {
  const { status, urgency } = req.query;

  const {
    where: searchField,
    skip,
    take,
    orderBy,
  } = SearchFilter(req, [
    "title",
    "description",
    "user.firstName",
    "user.lastName",
  ]);

  if (status) {
    searchField.status = status;
  }

  if (urgency) {
    searchField.urgency = urgency;
  }

  const studentRequests = await prisma.maintenanceRequest.findMany({
    where: searchField,
    skip,
    take,
    orderBy,
    include: { user: true },
  });

  res.status(200).json({ success: true, data: studentRequests });
});

//get maintenance record by id ADMIN
const getMaintenanceRById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!request) {
    res.status(404);
    return next(new Error("Maintenance request not found"));
  }

  res.status(200).json({ success: true, data: request });
});

// update maintenance record status ADMIN
const updateMaintenanceRStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, adminComment } = req.body;

  const statusOptions = Object.values(RequestStatus);
  if (!status || !statusOptions.includes(status)) {
    res.status(422);
    return next(
      new Error(`Status is required and must be one of: ${statusOptions.join(", ")}`)
    );
  }

  let resolvedAt = status === "RESOLVED" ? new Date() : null;

  const result = await prisma.$transaction(async (tx) => {
    // 2. Update the maintenance request
    const request = await tx.maintenanceRequest.update({
      where: { id: parseInt(id) },
      data: { status, resolvedAt, adminComment },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            deviceToken: true,
          },
        },
      },
    });

    const notifTitle = `Maintenance Update`;
    const notifBody = adminComment 
      ? `Update: ${adminComment}` 
      : `Your request "${request.title}" is now: ${request.status}.`;

    await tx.notification.create({
      data: {
        userId: request.user.id,
        title: notifTitle,
        message: notifBody,
        type: "MAINTENANCE_UPDATE",
      },
    });

    return { request, notifTitle, notifBody };
  });

  if (result.request.user?.deviceToken) {
    const extraData = {
      type: "maintenance_update",
      REQUEST_ID: result.request.id.toString(),
      status: result.request.status,
    };

    await sendNotificationToDevice({
      token: result.request.user.deviceToken,
      title: result.notifTitle,
      body: result.notifBody,
      data: extraData,
    }).catch((err) => console.error("FCM Error:", err));
  }

  res.status(200).json({ success: true, data: result.request });
});

//create maintenance record STUDENT
const createMaintenanceR = asyncHandler(async (req, res, next) => {
  const { title, description, urgency } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  if (!title || !description || !urgency) {
    res.status(422);
    return next(new Error("Title, description, and urgency are required"));
  }

  const result = await prisma.$transaction(async (tx) => {
    
    const newRequest = await tx.maintenanceRequest.create({
      data: {
        title,
        description,
        urgency,
        imageUrl,
        user: {
          connect: { id: req.user.userId },
        },
      },
    });

    const admins = await tx.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, deviceToken: true },
    });

    const student = await tx.user.findUnique({
      where: { id: req.user.userId },
      select: { firstName: true, lastName: true }
    });

    const studentName = student ? `${student.firstName} ${student.lastName}` : "A student";
    const notifTitle = "New Maintenance Request";
    const notifBody = `A new request "${title}" was created by ${studentName}.`;

    if (admins.length > 0) {
      await tx.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: notifTitle,
          message: notifBody,
          type: "MAINTENANCE_NEW", 
        })),
      });
    }

    return { newRequest, admins, notifTitle, notifBody };
  });

  result.admins.forEach((admin) => {
    if (admin.deviceToken) {
      sendNotificationToDevice({
        token: admin.deviceToken,
        title: result.notifTitle,
        body: result.notifBody,
        data: {
          type: "maintenance_request",
          REQUEST_ID: result.newRequest.id.toString(),
        },
      }).catch((err) => console.error(`FCM Error for admin ${admin.id}:`, err));
    }
  });

  res.status(201).json({ success: true, data: result.newRequest });
});

// update maintenance record STUDENT
const updateMaintenanceR = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, urgency } = req.body;

  const imageUrl = req.file ? req.file.path : undefined;

  const request = await prisma.maintenanceRequest.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!request) {
    res.status(404);
    return next(new Error("Maintenance request not found"));
  }

  if (request.userId !== req.user.userId && req.user.role === "STUDENT") {
    res.status(403);
    return next(new Error("Unauthorized to update this maintenance request"));
  }

  const updateRequest = await prisma.maintenanceRequest.update({
    where: { id: parseInt(id) },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(urgency && { urgency }),
      ...(imageUrl && { imageUrl })
    },
  });

  res.status(200).json({ success: true, data: updateRequest });
});

// Get maintenance requests for the logged-in student
const getMaintenanceMyRequests = asyncHandler(async (req, res, next) => {
  const { status, urgency } = req.query;

  const {
    where: searchWhere,
    skip,
    take,
    orderBy,
  } = SearchFilter(req, ["title", "description"]);

  const where = {
    userId: req.user.userId,
    ...searchWhere,
  };

  if (status) {
    where.status = status;
  }

  if (urgency) {
    where.urgency = urgency;
  }

  const studentRequests = await prisma.maintenanceRequest.findMany({
    where,
    skip,
    take,
    orderBy,
  });

  if (!studentRequests || studentRequests.length === 0) {
    res.status(404);
    return next(new Error("No maintenance requests found on your account"));
  }

  res.status(200).json({ success: true, data: studentRequests });
});

// get maintenance record by id STUDENT
const getMyMaintenanceRById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: parseInt(id) },
  });

  if (!request || request.userId !== req.user.userId) {
    res.status(404);
    return next(new Error("Maintenance request not found"));
  }

  res.status(200).json({ success: true, data: request });
});

//Delete maintenance record
const deleteMaintenanceR = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: parseInt(id) },
  });

  if(!request) {
    res.status(404);
    return next(new Error("Maintenance request not found"));
  }

  if (request.userId !== req.user.userId && req.user.role !== "ADMIN") {
    res.status(403);
    return next(new Error("Unauthorized to delete this maintenance request"));
  }

  await prisma.maintenanceRequest.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({ success: true, data: request });
});

module.exports = {
  getMaintenanceR,
  getMaintenanceRById,
  createMaintenanceR,
  updateMaintenanceRStatus,
  getMyMaintenanceRById,
  deleteMaintenanceR,
  updateMaintenanceR,
  getMaintenanceMyRequests,
};
