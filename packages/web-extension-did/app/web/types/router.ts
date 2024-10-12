import { RampType } from '@portkey-wallet/ramp';
import { ChainId } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { ToAccount, SendStage } from 'pages/Send';
import { GuardianItem } from './guardians';

// TokenDetail
export type TTokenDetailLocationState = {
  symbol: string;
  chainId: ChainId;
  balance: string;
  decimals: number;
  tokenContractAddress: string;
  balanceInUsd?: string;
};

// Send
export type TSendPageType = 'token' | 'nft';
export type TSendLocationState = BaseToken & {
  chainId: ChainId;
  targetChainId?: ChainId;
  toAccount?: ToAccount;
  stage?: SendStage;
  amount?: string;
  balance?: string;
  type?: TSendPageType;
  openGuardiansApprove?: boolean;
};

// Ramp
export type TRampLocationState = Partial<TRampPreviewLocationState>;

export type TRampPreviewLocationState = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: RampType;
  tokenInfo?: TTokenDetailLocationState;
  openGuardiansApprove?: boolean;
  approveList?: GuardianItem[];
};
