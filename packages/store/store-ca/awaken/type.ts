import { NetworkType } from '@portkey-wallet/types';

export type TAwakenState = {
  gasFee: {
    [T in NetworkType]?: string;
  };
  userSlippageTolerance: {
    [T in NetworkType]?: string;
  };
  userExpiration: {
    [T in NetworkType]?: string;
  };
};
