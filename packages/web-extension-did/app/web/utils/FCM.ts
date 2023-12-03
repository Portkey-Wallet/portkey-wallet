import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { DeviceTypeUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { getDeviceInfo } from './device';
import { DEVICE_TYPE } from 'constants/index';
import { randomId } from '@portkey-wallet/utils';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

export const deviceInfo = {
  deviceType: DeviceTypeUnit.EXTENSION,
  deviceBrand: 'browser',
  operatingSystemVersion: getDeviceInfo(DEVICE_TYPE).deviceName,
};

export const getFCMToken = async (): Promise<string> => {
  chrome.gcm.unregister((...args) => {
    console.log(args, '===getGCMToken===unregister===args');
  });

  return new Promise((resolve, reject) => {
    chrome.gcm.register([`${process.env.FCM_PROJECT_ID}`], (registrationId) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log(registrationId, '===getGCMToken===register===args');
        resolve(registrationId);
      }
    });
  });
};

export const unSetFCMToken = () => {
  chrome.gcm.unregister((...args) => {
    console.log(args, '===getGCMToken===unregister===args');
  });
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
  console.log('deviceId', deviceId, 'process.env.FCM_PROJECT_ID', process.env.FCM_PROJECT_ID);
  signalrFCM.init({
    deviceInfo,
    deviceId,
    getFCMTokenFunc: getFCMToken,
  });
};
