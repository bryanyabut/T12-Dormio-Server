const { PrismaClient } = require('../generated/prisma'); 
const prisma = new PrismaClient();

/**
 *  Get current student profile
 *  GET /api/v1/profile
 */
const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { 
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: "Profile not found" 
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 *  Create or Update student profile & sync User names
 *  PUT /api/v1/profile/sync
 */
const syncStudentProfile = async (req, res) => {
  const { studentId, firstName, lastName, roomNumber } = req.body;
  const userId = req.user.id || req.user.userId;

  try {
    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName }
      }),
      prisma.profile.upsert({
        where: { userId: userId },
        update: { studentId, firstName, lastName, roomNumber },
        create: { 
          userId, 
          studentId, 
          firstName, 
          lastName, 
          roomNumber 
        },
      })
    ]);

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      data: result[1] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to sync profile: " + error.message 
    });
  }
};

module.exports = { 
  getProfile, 
  syncStudentProfile 
};