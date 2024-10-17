import { request } from '@portkey-wallet/api/api-did';
import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import { IAssetItemType, IAssetNftCollection, IAssetToken } from './type';
import { NFT_SMALL_SIZE, NFT_MIDDLE_SIZE, NFT_LARGE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { ChainId } from '@portkey-wallet/types';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { SendType } from '@portkey-wallet/types/types-ca/send';

export function fetchTokenList({
  // todo maybe remote tokenList change
  skipCount = 0,
  maxResultCount = 1000,
  caAddressInfos,
}: {
  skipCount?: number;
  maxResultCount?: number;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{
  data: ITokenSectionResponse[];
  totalRecordCount: number;
  totalBalanceInUsd?: string;
}> {
  return request.assets.fetchAccountTokenListV2({
    params: {
      caAddressInfos,
      skipCount,
      maxResultCount,
      version: '1.11.1',
    },
  });
}

export function fetchAssetList({
  caAddressInfos,
  maxResultCount,
  skipCount,
  keyword = '',
}: {
  maxResultCount: number;
  skipCount: number;
  keyword: string;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ data: IAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountAssetsByKeywords({
    params: {
      caAddressInfos,
      skipCount,
      maxResultCount,
      keyword,
      width: NFT_SMALL_SIZE,
      height: -1,
    },
  });
}

export function fetchAssetListV2({
  caAddressInfos,
  maxResultCount = 1000,
  skipCount = 0,
  keyword = '',
}: {
  maxResultCount?: number;
  skipCount?: number;
  keyword: string;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ nftInfos: IAssetNftCollection[]; tokenInfos: IAssetToken[]; totalRecordCount: number }> {
  console.log('fetchAccountAssetsByKeywordsV2');
  return request.assets.fetchAccountAssetsByKeywordsV2({
    params: {
      caAddressInfos,
      skipCount,
      maxResultCount,
      keyword,
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
      version: '1.11.1',
    },
  });
}

export function fetchNFTSeriesList({
  caAddressInfos,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  skipCount: number;
  maxResultCount?: number;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ data: any[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionList({
    params: {
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
  caAddressInfos,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  symbol: string;
  caAddressInfos: { chainId: string; caAddress: string }[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: NFTItemBaseType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionItemList({
    params: { caAddressInfos, symbol, skipCount, maxResultCount, width: NFT_MIDDLE_SIZE, height: -1 },
  });
}

export function fetchNFTItem({
  symbol,
  caAddressInfos,
}: {
  symbol: string;
  caAddressInfos: { chainId: string; caAddress: string }[];
}): Promise<{ data: NFTItemBaseType }> {
  return request.assets.fetchAccountNftCollectionItem({
    params: { caAddressInfos, symbol, width: NFT_LARGE_SIZE, height: -1 },
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

export function fetchTokenBalance({
  symbol,
  chainId,
  currentCaAddress: caAddress,
}: {
  symbol: string;
  chainId: ChainId;
  currentCaAddress: string;
}): Promise<{
  balance: string;
  balanceInUsd: string;
  decimals: string;
}> {
  return request.assets.getTokenBalance({
    params: {
      symbol,
      chainId,
      caAddress,
    },
  });
}
export function getAssetsEstimation({
  symbol,
  chainId,
  type,
}: {
  symbol: string;
  chainId: ChainId;
  type: SendType;
}): Promise<boolean> {
  return request.assets.getAssetsEstimation({
    params: {
      symbol,
      chainId,
      type,
    },
  });
}

export function fetchTokenAllowanceList({
  skipCount = 0,
  maxResultCount = 1000,
  caAddressInfos,
}: {
  caAddressInfos: { chainId: string; caAddress: string }[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: ITokenAllowance[]; totalRecordCount: number }> {
  return request.assets.fetchTokenAllowanceList({
    params: { caAddressInfos, skipCount, maxResultCount },
  });
}
