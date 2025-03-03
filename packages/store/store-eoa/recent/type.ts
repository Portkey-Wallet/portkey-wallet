import { ChainId } from '@portkey-wallet/types';

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
  networkIcon?: string;
  transferTime: number;
}

export interface RecentStateType {
  recentMap: {
    [key: string]: IRecentItem[];
  };
}
