import { request } from '@portkey-wallet/api/api-did';
import { baseStore } from '@portkey-wallet/utils/mobile/storage';
import { nativeApplicationVersion } from 'expo-application';

request.set('headers', { version: `v${nativeApplicationVersion}` });
request.setStorage(baseStore);
