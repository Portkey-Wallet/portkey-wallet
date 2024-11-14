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

export const SEND_RECEIVE_HELP_URL = 'https://doc.portkey.finance/docs/How-to-send-and-receive-assets';

export const AELF_NETWORK_NAME = 'aelf';
export const networkList = [
  {
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/dappChain.png',
    name: 'aelf dAppChain',
    key: 'aelf dAppChain',
  },
  {
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/mainChain.png',
    name: 'aelf MainChain',
    key: 'aelf MainChain',
  },
];
