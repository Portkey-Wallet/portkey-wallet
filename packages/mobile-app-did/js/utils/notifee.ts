import notifee from '@notifee/react-native';
import * as Notifications from 'expo-notifications';

async function onDisplayNotification(): Promise<void> {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

async function onUpdateNotification(channelId: string): Promise<void> {
  if (!channelId) return console.log('this channelId not found');
  await notifee.displayNotification({
    id: 'default',
    title: 'Updated Notification Title',
    body: 'Updated main body content of the notification ',
    android: {
      channelId,
    },
  });
}

export const initNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  });
};

export const setBadge = async (count: number) => {
  const currentBadgeCount = await Notifications.getBadgeCountAsync();
  if (currentBadgeCount === count) return;

  return await Notifications.setBadgeCountAsync(count);
};

export const resetBadge = async () => {
  return await Notifications.setBadgeCountAsync(0);
};

export default {
  initNotifications,
  setBadge,
  resetBadge,
  onDisplayNotification,
  onUpdateNotification,
};
