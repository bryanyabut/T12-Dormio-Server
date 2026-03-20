const { prisma } = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

//
const getStudents = asyncHandler(async (req, res, next) => {
    const students = await prisma.user.findMany({
    where: { role: 'STUDENT'},
    select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        address: true
    }

});
    res.status(200).json({ success: true, data: students });
});

const createStudent = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, passwordHash, address } = req.body;

  const newStudent = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      role: "STUDENT",
      // Only create address if provided
      address: address ? { create: address } : undefined
    },
    include: {
      address: true
    }
  });

  res.status(201).json({ success: true, data: newStudent });
});

module.exports = { getStudents, createStudent };