import { NetworkType } from '@portkey-wallet/types';

export type TAwakenState = {
  gasFee: {
    [T in NetworkType]?: string;
  };
};
