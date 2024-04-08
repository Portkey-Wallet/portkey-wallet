import { Password } from '@portkey-wallet/types/wallet';
// import { TUpdateInfo } from 'utils/update';
export type TUpdateInfo = {
  version?: string | null;
  label?: string | null;
  title?: string | null;
  content?: string | null;
  isForceUpdate?: boolean | null;
  updatedTitle?: string | null;
  updatedContent?: string | null;
};
export type Credentials = {
  pin: Password;
};
export interface UserStoreState {
  credentials?: Credentials;
  biometrics?: boolean;
  updateInfo?: TUpdateInfo;
}
