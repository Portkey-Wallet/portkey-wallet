import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { DeviceTypeUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { getDeviceInfo } from './device';
import { DEVICE_TYPE } from 'constants/index';
import { randomId } from '@portkey-wallet/utils';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';

export const deviceInfo = {
  deviceType: DeviceTypeUnit.EXTENSION,
  deviceBrand: 'browser',
  operatingSystemVersion: getDeviceInfo(DEVICE_TYPE).deviceName,
};

export const getFCMToken = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.gcm.register([`${process.env.FCM_PROJECT_ID}`], (registrationId) => {
      if (chrome.runtime.lastError) {
        console.log('getGCMToken===reject===', chrome.runtime.lastError);
        resolve('');
      } else {
        resolve(registrationId);
      }
    });
  });
};

export const initFCMMessage = () => {
  InternalMessage.payload(PortkeyMessageTypes.INIT_FCM_MESSAGE).send();
};

export const unRegisterFCM = () => {
  InternalMessage.payload(PortkeyMessageTypes.UN_REGISTER_FCM).send();
};

export const setBadge = async ({ value, color }: { value?: string | number; color?: string }) => {
  await InternalMessage.payload(PortkeyMessageTypes.SET_BADGE, { value, color }).send();
};

const generateDeviceId = async () => {
  const deviceId = await getLocalStorage('deviceId');

  if (deviceId) return deviceId;

  const id = randomId();
  await setLocalStorage({ deviceId: id });
  return id;
};

export const initFCMSignalR = async () => {
  const deviceId = await generateDeviceId();
  console.log('generateDeviceId', deviceId);
  signalrFCM.init({
    deviceInfo,
    deviceId,
    getFCMTokenFunc: getFCMToken,
  });
};
