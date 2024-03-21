import notifee from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

async function onAppBootstrap() {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  console.log('Remote Message Token', token);
  // Save the token
  // await postToApi('/users/1234/tokens', { token });
}

async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
  console.log('onMessageReceived: ', message);
  if (!message.messageId) {
    return;
  }
  // Do something
  const channelId = await notifee.createChannel({
    // id: 'default',
    id: message.messageId,
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    id: Date.now().toString(),
    title: 'Notification Title',
    body: 'Main body content of the notification ' + channelId,
    android: {
      channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    },
  });
}

onAppBootstrap();
console.log('messaging init start');
messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
console.log('messaging init end');
