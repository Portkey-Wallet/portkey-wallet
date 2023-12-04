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
  return new Promise((resolve) => {
    chrome.gcm.register([`${process.env.FCM_PROJECT_ID}`], (registrationId) => {
      if (chrome.runtime.lastError) {
        console.log('===getGCMToken===reject===', chrome.runtime.lastError);
        resolve('');
      } else {
        console.log(registrationId, '===getGCMToken===register===');
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
  console.log('generateDeviceId', deviceId);
  signalrFCM.init({
    deviceInfo,
    deviceId,
    getFCMTokenFunc: getFCMToken,
  });
};
