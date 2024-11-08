export interface TAwakenTokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  id: string;
  imageUri?: string;
}

export type TTradePair = {
  chainId: string;
  address: string;
  feeRate: number;
  isTokenReversed: boolean;
  token0: TAwakenTokenInfo;
  token1: TAwakenTokenInfo;
  id: string;
};

export type PBTimestamp = {
  seconds: number;
  nanos: number;
};

export type TCurrency = {
  symbol: string;
  balance: string;
  balanceInUsd: string;
  imageUrl: string;
  label: null;
  displayChainName: string;
  chainImageUrl: string;
  chainId: string;
  decimals: number;
};
