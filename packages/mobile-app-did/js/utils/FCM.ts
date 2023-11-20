import { isIOS } from '@portkey-wallet/utils/mobile/device';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request } from 'react-native-permissions';
import { PermissionsAndroid, Platform } from 'react-native';

import { copyText } from 'utils';
import { getDeviceInfo } from './deviceInfo';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';

export const requestUserPermission = async () => {
  // iOS permission
  if (isIOS) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) console.log('Authorization status:', authStatus);

    return enabled;
  }

  // android permission
  let androidResult;
  const deviceAPiLevel = Platform.Version;
  if (Number(deviceAPiLevel) >= 33) {
    androidResult = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  } else {
    androidResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
  console.log('androidResult');
  return androidResult === 'granted';
};

export const getFCMToken = async (refresh?: boolean): Promise<string> => {
  try {
    // Usage of "messaging().registerDeviceForRemoteMessages()" is not required. You only need to register if auto-registration is disabled in your 'firebase.json' configuration file via the 'messaging_ios_auto_register_for_remote_messages' property.
    // const result = await messaging().registerDeviceForRemoteMessages();
    // console.log('result', result);
    if (refresh) await messaging().deleteToken();
    const token = await messaging().getToken();
    console.log('fcm token', token);

    if (__DEV__) {
      alert(token);
      await copyText(token);
    }
    // save the token to the db
    return token;
  } catch (error) {
    console.log('getFCMToken error', error);
    return '';
  }
};

export const initFCMSignalR = async () => {
  const deviceInfo = await getDeviceInfo();

  await requestUserPermission();

  await signalrFCM.init({
    deviceInfo,
    deviceId: deviceInfo.deviceId,
    getFCMTokenFunc: getFCMToken,
  });
};
