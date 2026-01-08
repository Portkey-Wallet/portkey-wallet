import { request } from '@portkey-wallet/api/api-did';
import { nativeApplicationVersion } from 'expo-application';
import { PlatFormInHeader } from '@portkey-wallet/api/api-did/types';
import im from '@portkey-wallet/im';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { Platform } from 'react-native';

export const initRequest = async () => {
  request.set('headers', {
    version: `v${nativeApplicationVersion}`,
    platform: isIOS ? PlatFormInHeader.IOS : Platform.OS === 'android' ? PlatFormInHeader.ANDROID : 'unknown',
  });
  im.setHeader('version', `v${nativeApplicationVersion}`);
  im.setHeader(
    'platform',
    isIOS ? PlatFormInHeader.IOS : Platform.OS === 'android' ? PlatFormInHeader.ANDROID : 'unknown',
  );
};
