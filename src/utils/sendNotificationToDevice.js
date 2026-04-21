const admin = require('../config/firebase');

const sendNotificationToDevice = async ({token, title, body, data = {}}) => {
  if (!token) {
    console.warn('Skipping notification: No device token provided.');
    return;
  }

  try {
    await admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value.toString()])
      ),
      android: {
        priority: 'high',
        notification: {
          channelId: 'maintenance_channel', 
          sound: 'default'
        },
      },
    });

    console.log('Notification sent successfully to:', token);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = sendNotificationToDevice;