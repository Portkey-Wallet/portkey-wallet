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
