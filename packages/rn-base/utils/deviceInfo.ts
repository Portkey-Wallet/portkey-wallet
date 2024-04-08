import { DeviceTypeUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import * as Device from 'expo-device';
import { getUniqueId } from 'react-native-device-info';

export const getDeviceInfo = async () => {
  return {
    deviceId: await getUniqueId(),
    deviceType: isIOS ? DeviceTypeUnit.IOS : DeviceTypeUnit.ANDROID,
    deviceBrand: Device.brand || '',
    operatingSystemVersion: `${Device.osName}${Device.osVersion}`,
  };
};
