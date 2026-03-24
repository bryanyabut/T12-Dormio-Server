const { PrismaClient } = require('../generated/prisma'); 
const prisma = new PrismaClient();

/**
 *  Get current student profile
 *  GET /api/v1/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      data: profile 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 *  Create or Update student profile & sync User names
 *  PUT /api/v1/profile
 */
const updateProfile = async (req, res) => {
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

const updateAvatar = async (req, res) => {
  console.log("Multer File:", req.file); 
  console.log("User from Token:", req.user);

  try {
    const userId = req.user.id || req.user.userId;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: userId },
      data: { avatarUrl: req.file.path }
    });

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      url: updatedProfile.avatarUrl
    });
  } catch (error) {
    console.error("PRISMA/CLOUDINARY ERROR:", error); 
    
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
};

module.exports = { 
  getProfile, 
  updateProfile,
  updateAvatar
};