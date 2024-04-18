import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';

export function fetchAllTokenList({
  keyword,
  chainIdArray,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  keyword: string;
  chainIdArray: string[];
  skipCount?: number;
  maxResultCount?: number;
}): Promise<{
  items: {
    id: string;
    chainId: ChainId;
    symbol: string;
    decimals: number;
    isDefault: boolean;
    isDisplay: boolean;
    address: string;
    imageUrl?: string;
    name?: string;
  }[];
  totalCount: number;
}> {
  return request.token.fetchPapularToken({
    params: {
      chainIds: chainIdArray,
      keyword,
      skipCount,
      maxResultCount,
    },
  });
}
