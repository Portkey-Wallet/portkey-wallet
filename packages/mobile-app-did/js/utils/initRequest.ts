import { request } from '@portkey-wallet/api/api-did';
import { nativeApplicationVersion } from 'expo-application';

request.set('headers', { version: `v${nativeApplicationVersion}` });
