import notifee from '@notifee/react-native';

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

export default {
  onDisplayNotification,
  onUpdateNotification,
};
