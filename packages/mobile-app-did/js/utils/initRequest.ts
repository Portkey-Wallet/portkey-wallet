import { request } from '@portkey-wallet/api/api-did';
import { nativeApplicationVersion } from 'expo-application';
import { PlatFormInHeader } from '@portkey-wallet/api/api-did/types';
import { codePushOperator } from './update';
import im from '@portkey-wallet/im';

export const initRequest = async () => {
  const localPackage = await codePushOperator.initLocalPackage();
  const hotfixLabel = localPackage?.label ?? 0;
  request.set('headers', { version: `v${nativeApplicationVersion}.` + hotfixLabel, platform: PlatFormInHeader.APP });
  im.setHeader('version', `v${nativeApplicationVersion}.` + hotfixLabel);
  im.setHeader('platform', PlatFormInHeader.APP);
};
