import { ChainId, NetworkType } from 'packages/types';

export type TxFeeItem = {
  [key in ChainId]?: {
    ach: number;
    crossChain: number;
    max: number;
  };
};

export type TxFeeType = {
  [key in NetworkType]?: TxFeeItem;
};
