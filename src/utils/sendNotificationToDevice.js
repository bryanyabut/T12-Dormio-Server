// sendNotificationToDevice.js
const admin = require('../config/firebase');

const sendNotificationToDevice = async (deviceToken, data) => {
  if (!deviceToken) return;

  try {
    await admin.messaging().send({
      token: deviceToken,
      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value.toString()])
      ),
      android: {
        priority: 'high',
        notification: { channelId },
      },
    });

    console.log('Notification sent successfully as data message');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = sendNotificationToDevice;