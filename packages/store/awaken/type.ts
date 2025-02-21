import { NetworkType } from '@portkey-wallet/types';
import { TCurrency } from '@portkey-wallet/types/awaken';

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
  tokenPrices: {
    [T in NetworkType]?: Record<string, string>;
  };
  tokenList: {
    // [T in NetworkType]?: TCurrency[];
    [T: string]: TCurrency[];
  };
};
