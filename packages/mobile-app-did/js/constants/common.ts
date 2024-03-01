import { Platform } from 'react-native';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';

export const DEVICE_TYPE: DeviceType = (() => {
  let deviceType: DeviceType;
  switch (Platform.OS) {
    case 'ios':
      deviceType = DeviceType.IOS;
      break;
    case 'android':
      deviceType = DeviceType.ANDROID;
      break;
    default:
      deviceType = DeviceType.OTHER;
      break;
  }
  return deviceType;
})();

export const APP_SCHEMA = 'portkey.did';

export const RAMP_BUY_URL = 'https://thirdparty.portkey.finance/buy?from=app';

export const RAMP_SELL_URL = 'https://thirdparty.portkey.finance/sell?from=app';

export const DISCOVER_BOOKMARK_MAX_COUNT = 30;
