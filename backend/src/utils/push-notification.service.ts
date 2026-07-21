import { getMessaging } from 'firebase-admin/messaging';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>; // extra data sent to frontend
}

export const sendPushNotification = async (fcmToken: string, payload: PushNotificationPayload): Promise<void> => {
  try {
    console.log('📤 Sending push to token:', fcmToken);
    const result = await getMessaging().send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data ?? {},
    });
    console.log('✅ Push sent successfully, messageId:', result);
  } catch (error) {
    console.error('Push notification failed:', error);
  }
};
