import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { IconType } from 'types/icon';

export const getDeviceInfo = (deviceType: DeviceType): DeviceInfoType => {
  switch (deviceType) {
    case DeviceType.MAC: {
      return { deviceName: 'macOS', deviceType };
    }
    case DeviceType.WINDOWS: {
      return { deviceName: 'Windows', deviceType };
    }
    default: {
      return { deviceName: 'Other', deviceType };
    }
  }
};

export const getDeviceIcon = (device: DeviceType): IconType => {
  switch (device) {
    case DeviceType.ANDROID:
      return 'phone-Android';
    case DeviceType.IOS:
      return 'phone-iOS';
    case DeviceType.MAC:
      return 'desk-mac';
    case DeviceType.WINDOWS:
      return 'desk-win';
    default:
      return 'desk-win';
  }
};
