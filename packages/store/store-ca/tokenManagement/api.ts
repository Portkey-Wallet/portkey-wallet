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
  data: {
    symbol: string;
    imageUrl?: string;
    label?: string;
    displayStatus?: 'all' | 'partial' | 'none';
    tokens?: {
      id: string;
      chainId: ChainId;
      symbol: string;
      imageUrl?: string;
      address?: string;
      decimals: number;
      isDefault: boolean;
      isDisplay: boolean;
      label?: string;
    }[];
  }[];
  totalCount: number;
}> {
  return request.token.fetchPopularTokenV2({
    params: {
      chainIds: chainIdArray,
      keyword,
      skipCount,
      maxResultCount,
    },
  });
}

export function fetchAllTokenListLegacy({
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
    label?: string;
  }[];
  totalCount: number;
}> {
  return request.token.fetchPopularToken({
    params: {
      chainIds: chainIdArray,
      keyword,
      skipCount,
      maxResultCount,
    },
  });
}
