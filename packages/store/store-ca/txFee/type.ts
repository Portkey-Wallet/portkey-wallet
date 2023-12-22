import { ChainId, NetworkType } from '@portkey-wallet/types';

export type TxFeeItem = {
  [key in ChainId]?: {
    ach: number;
    crossChain: number;
    max: number;
    redPackage: number;
  };
};

export type TxFeeType = {
  [key in NetworkType]?: TxFeeItem;
};
