const admin = require('../config/firebase');

const sendNotificationToDevice = async (deviceToken, title, body) => {
    if (!deviceToken) return;

    try {
        await admin.messaging().send({
            token: deviceToken,
            notification: {
                title,
                body
            }
        });
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = sendNotificationToDevice;