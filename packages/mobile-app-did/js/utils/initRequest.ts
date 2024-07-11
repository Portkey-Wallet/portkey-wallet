import { request } from '@portkey-wallet/api/api-did';
import { nativeApplicationVersion } from 'expo-application';
import { PlatFormInHeader } from '@portkey-wallet/api/api-did/types';
import { codePushOperator } from './update';

const hotfixLabel = codePushOperator.localPackage?.label ?? 0;
request.set('headers', { version: `v${nativeApplicationVersion}` + hotfixLabel, platform: PlatFormInHeader.APP });
