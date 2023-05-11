import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { AutoLockDataType } from 'constants/lock';
import { RegisterStatus } from 'types';

export interface IPageState {
  lockTime: AutoLockDataType;
  registerStatus: RegisterStatus;
  wallet: WalletState;
}

export interface BaseInternalMessagePayload {
  from: string;
  hostname: string;
  href: string;
  method: string;
  origin: string;
}

export interface InternalMessagePayload extends BaseInternalMessagePayload {
  params: any;
}

export interface InternalMessageData {
  type: string;
  payload: any;
}
