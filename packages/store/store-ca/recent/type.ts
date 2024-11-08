import { ChainId, NetworkType } from '@portkey-wallet/types';

export interface loginInfo {
  account: string;
  accountType?: 'phone' | 'email';
  loginType?: 'register' | 'login';
}

export interface LoginState {
  loginAccount?: loginInfo;
}

export interface IRecentItem {
  address: string;
  chainId?: ChainId;
  network: 'aelf' | string;
  transferTime: number;
}

export interface RecentStateType {
  recentMap: {
    [T in NetworkType]?: {
      [key: string]: IRecentItem[]; // key is symbol-chainId
    };
  };
}
