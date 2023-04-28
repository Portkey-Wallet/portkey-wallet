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

type messageAddEventListenerProps = {
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => any;
  backgroundCallback: (message: FirebaseMessagingTypes.RemoteMessage) => any;
};
async function messageAddEventListener({ callback, backgroundCallback }: messageAddEventListenerProps) {
  messaging().onMessage(callback);
  messaging().setBackgroundMessageHandler(backgroundCallback);
}

export default {
  onAppBootstrap,
  messageAddEventListener,
};
