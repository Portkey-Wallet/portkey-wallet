import { PBTimestamp, TAwakenTokenInfo, TTradePair } from '.';

export type TTradePairExtension = {
  valueLocked0: string;
  valueLocked1: string;
};

export type TSwapRouteDistribution = {
  percent: number;
  amountIn: string;
  amountOut: string;
  tradePairs: TTradePair[];
  tradePairExtensions: TTradePairExtension[];
  tokens: TAwakenTokenInfo[];
  amounts: string[];
  feeRates: number[];
};

export type TSwapRoute = {
  amountIn: string;
  amountOut: string;
  splits: number;
  distributions: TSwapRouteDistribution[];
};

export type TContractSwapToken = {
  amountIn?: string;
  amountOutMin?: string;
  amountOut?: string;
  amountInMax?: string;
  channel: string;
  deadline: number | PBTimestamp;
  path: string[];
  to: string;
  feeRates: number[];
};
