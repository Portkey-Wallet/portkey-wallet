import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { DeviceTypeUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { getDeviceInfo } from './device';
import { DEVICE_TYPE } from 'constants/index';

export const deviceInfo = {
  deviceType: DeviceTypeUnit.EXTENSION,
  deviceBrand: 'browser',
  operatingSystemVersion: getDeviceInfo(DEVICE_TYPE).deviceName,
};

export const FCMID = '339329964702';

export const getFCMToken = async (): Promise<string> => {
  chrome.gcm.unregister((...args) => {
    console.log(args, '===getGCMToken===unregister===args');
  });

  return new Promise((resolve, reject) => {
    chrome.gcm.register(['339329964702'], (registrationId) => {
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

export const initFCMSignalR = () => {
  signalrFCM.init({
    deviceInfo: deviceInfo,
    deviceId: chrome.runtime.id,
    getFCMTokenFunc: getFCMToken,
  });
};
