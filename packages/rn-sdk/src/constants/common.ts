import { ErrorType } from 'types/common';
import { Platform } from 'react-native';
import { DeviceType } from 'packages/types/types-ca/device';

export const INIT_ERROR: ErrorType = {
  errorMsg: '',
  isError: false,
};

export const INIT_NONE_ERROR: ErrorType = INIT_ERROR;

export const INIT_HAS_ERROR: ErrorType = {
  errorMsg: '',
  isError: true,
};

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

export const ACH_REDIRECT_URL = 'http://portkey';

export const ACH_WITHDRAW_URL = 'http://portkey_sell';

export const DISCOVER_BOOKMARK_MAX_COUNT = 30;

export const DEFAULT_VIEW_PRIVATE_KEY = '28805dd286a972f0ff268ba42646d5d952d770141bfec55c98e10619c268ecea';
