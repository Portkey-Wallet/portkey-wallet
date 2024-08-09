import { request } from '@portkey-wallet/api/api-did';
import { nativeApplicationVersion } from 'expo-application';
import { PlatFormInHeader } from '@portkey-wallet/api/api-did/types';
import { codePushOperator, parseLabel } from './update';
import im from '@portkey-wallet/im';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { Platform } from 'react-native';

export const initRequest = async () => {
  const localPackage = await codePushOperator.initLocalPackage();
  const hotfixLabel = parseLabel(localPackage?.label) ?? 0;
  request.set('headers', {
    version: `v${nativeApplicationVersion}.` + hotfixLabel,
    platform: isIOS ? PlatFormInHeader.IOS : Platform.OS === 'android' ? PlatFormInHeader.ANDROID : 'unknown',
  });
  im.setHeader('version', `v${nativeApplicationVersion}.` + hotfixLabel);
  im.setHeader(
    'platform',
    isIOS ? PlatFormInHeader.IOS : Platform.OS === 'android' ? PlatFormInHeader.ANDROID : 'unknown',
  );
};
