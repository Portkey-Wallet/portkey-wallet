import { Verification } from '@portkey-wallet/api/api-did/verification/utils';
import { baseStore } from '@portkey-wallet/utils/mobile/storage';

export const verification = new Verification(baseStore);
