import { Verification } from '@portkey-wallet/api/api-did/verification/utils';
import { localStorage } from 'redux-persist-webextension-storage';

export const verification = new Verification(localStorage);
