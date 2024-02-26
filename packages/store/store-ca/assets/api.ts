import { request } from '@portkey-wallet/api/api-did';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IAssetItemType, ICryptoBoxAssetItemType } from './type';
import { NFT_SMALL_SIZE, NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';

type ITokenItemResponse = Omit<TokenItemShowType, 'name' | 'address'>;

export function fetchTokenList({
  // todo maybe remote tokenList change
  skipCount = 0,
  maxResultCount = 1000,
  caAddresses,
  caAddressInfos,
}: {
  skipCount?: number;
  maxResultCount?: number;
  caAddresses: string[];
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{
  data: ITokenItemResponse[];
  totalRecordCount: number;
}> {
  return request.assets.fetchAccountTokenList({
    params: {
      caAddresses,
      caAddressInfos,
      skipCount,
      maxResultCount,
    },
  });
}

export function fetchAssetList({
  caAddresses,
  caAddressInfos,
  maxResultCount,
  skipCount,
  keyword = '',
}: {
  caAddresses: string[];
  maxResultCount: number;
  skipCount: number;
  keyword: string;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ data: IAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountAssetsByKeywords({
    params: {
      CaAddresses: caAddresses,
      caAddressInfos,
      SkipCount: skipCount,
      MaxResultCount: maxResultCount,
      Keyword: keyword,
      width: NFT_SMALL_SIZE,
      height: -1,
    },
  });
}

export function fetchCryptoBoxAssetList({
  caAddressInfos,
  maxResultCount,
  skipCount,
  keyword = '',
}: {
  maxResultCount: number;
  skipCount: number;
  keyword: string;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ data: ICryptoBoxAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchCryptoBoxAccountAssetsByKeywords({
    params: {
      caAddressInfos,
      keyword,
      skipCount,
      maxResultCount,
      width: NFT_SMALL_SIZE,
      height: -1,
    },
  });
}

export function fetchNFTSeriesList({
  caAddresses = [],
  caAddressInfos,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  caAddresses: string[];
  skipCount: number;
  maxResultCount?: number;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ data: any[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionList({
    params: {
      caAddresses,
      caAddressInfos,
      skipCount,
      maxResultCount,
      width: NFT_SMALL_SIZE,
      height: -1,
    },
  });
}

export function fetchNFTList({
  symbol,
  caAddresses,
  caAddressInfos,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  symbol: string;
  caAddresses: string[];
  caAddressInfos: { chainId: string; caAddress: string }[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionItemList({
    params: { caAddresses, caAddressInfos, symbol, skipCount, maxResultCount, width: NFT_MIDDLE_SIZE, height: -1 },
  });
}

export function fetchTokenPrices({
  symbols,
}: {
  symbols: string[];
}): Promise<{ items: { symbol: string; priceInUsd: number }[]; totalRecordCount: number }> {
  console.log('fetchTokenPrices....');

  return request.token.fetchTokenPrice({
    params: {
      symbols,
    },
  });
}
