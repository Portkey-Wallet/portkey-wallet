import { DeviceInfoType, DeviceType } from 'packages/types/types-ca/device';

export const DEVICE_INFO_VERSION = '2.0.0';

export const DEVICE_TYPE_INFO: Record<DeviceType, DeviceInfoType> = {
  [DeviceType.OTHER]: {
    deviceName: 'Other',
    deviceType: DeviceType.OTHER,
  },
  [DeviceType.MAC]: {
    deviceName: 'macOS',
    deviceType: DeviceType.MAC,
  },
  [DeviceType.IOS]: {
    deviceName: 'iOS',
    deviceType: DeviceType.IOS,
  },
  [DeviceType.WINDOWS]: {
    deviceName: 'Windows',
    deviceType: DeviceType.WINDOWS,
  },
  [DeviceType.ANDROID]: {
    deviceName: 'Android',
    deviceType: DeviceType.ANDROID,
  },
};
