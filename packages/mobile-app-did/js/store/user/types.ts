import { Password } from '@portkey-wallet/types/wallet';

export type Credentials = {
  pin: Password;
};
export interface UserStoreState {
  credentials?: Credentials;
  biometrics?: boolean;
}
