import { isIOS } from '@portkey-wallet/utils/mobile/device';
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Platform } from 'react-native';

import { copyText } from '.';
import { getDeviceInfo } from './deviceInfo';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { FCMMessageData } from '../types/common';
import { NetworkType } from '@portkey-wallet/types';

export const requestUserNotifyPermission = async () => {
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
    return true;
  }
  return androidResult === 'granted';
};

export const getFCMToken = async (refresh?: boolean): Promise<string> => {
  try {
    if (refresh) await messaging().deleteToken();
    const token = await messaging().getToken();
    if (__DEV__) await copyText(token);
    console.log('fcm token', token);

    return token;
  } catch (error) {
    console.log('getFCMToken error', error);
    return '';
  }
};

export const deleteFCMToken = () => {
  return messaging().deleteToken();
};

export const initFCMSignalR = async () => {
  const deviceInfo = await getDeviceInfo();

  console.log('initFCMSignalR', deviceInfo);

  await signalrFCM.init({
    deviceInfo,
    deviceId: deviceInfo.deviceId,
    getFCMTokenFunc: getFCMToken,
  });
};

export const checkMessageIsFromMainnet = (message: FCMMessageData) => {
  return message.network.toLocaleLowerCase().includes('main');
};

export const getFcmMessageNetwork = (message?: FCMMessageData): NetworkType => {
  if (message?.network?.toLocaleLowerCase()?.includes('main')) return 'MAINNET';
  if (message?.network?.toLocaleLowerCase()?.includes('test')) return 'TESTNET';
  return 'MAINNET';
};
