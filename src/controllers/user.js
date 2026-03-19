const {prisma} = require('../config/db');
const { RequestStatus } = require('../generated/prisma');

const updateDeviceToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({ error: 'Device token is required.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { deviceToken },
      select: { id: true, email: true, deviceToken: true }
    });

    res.json({
      message: 'Device token was updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating device token:', error);
    res.status(500).json({ error: 'An error occurred while updating the device token.' });
  }
};

module.exports = { updateDeviceToken };
