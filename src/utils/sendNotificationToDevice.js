const admin = require('../config/firebase');

const sendNotificationToDevice = async (deviceToken, title, body, extraData = {}) => {
  if (!deviceToken) {
    console.warn('Skipping notification: No device token provided.');
    return;
  }

  try {
    await admin.messaging().send({
      token: deviceToken,
      notification: {
        title: title,
        body: body,
      },
      data: Object.fromEntries(
        Object.entries(extraData).map(([key, value]) => [key, value.toString()])
      ),
      android: {
        priority: 'high',
        notification: {
          channelId: 'default_channel_id', 
          sound: 'default'
        },
      },
    });

    console.log('Notification sent successfully to:', deviceToken);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = sendNotificationToDevice;