import { request } from '@portkey-wallet/api/api-did';
import { nativeApplicationVersion } from 'expo-application';
import { PlatFormInHeader } from '@portkey-wallet/api/api-did/types';

request.set('headers', { version: `v${nativeApplicationVersion}`, platform: PlatFormInHeader.APP });
