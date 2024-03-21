import { Password } from '@portkey-wallet/types/wallet';
import { TUpdateInfo } from 'utils/update';

export type Credentials = {
  pin: Password;
};
export interface UserStoreState {
  credentials?: Credentials;
  biometrics?: boolean;
  updateInfo?: TUpdateInfo;
}
