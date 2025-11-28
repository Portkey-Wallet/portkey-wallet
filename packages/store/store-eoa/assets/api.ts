import { request } from '@portkey-wallet/api/api-eoa';
import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import { IAssetItemType, IAssetNftCollection, IAssetToken } from './type';
import {
  NFT_SMALL_SIZE,
  NFT_MIDDLE_SIZE,
  NFT_LARGE_SIZE,
  NFT_MIDDLE_X_SIZE,
} from '@portkey-wallet/constants/constants-ca/assets';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { ChainId } from '@portkey-wallet/types';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { SendType } from '@portkey-wallet/types/types-ca/send';

export function fetchTokenList({
  // todo maybe remote tokenList change
  skipCount = 0,
  maxResultCount = 1000,
  addressInfos,
}: {
  skipCount?: number;
  maxResultCount?: number;
  addressInfos: { chainId: string; address: string }[];
}): Promise<{
  data: ITokenSectionResponse[];
  totalRecordCount: number;
  totalDisplayCount: number;
  totalBalanceInUsd?: string;
}> {
  return request.assets.fetchAccountTokenList({
    params: {
      addressInfos,
      skipCount,
      maxResultCount,
      version: '1.11.1',
    },
  });
}

export function fetchAssetList({
  addressInfos,
  maxResultCount,
  skipCount,
  keyword = '',
}: {
  maxResultCount: number;
  skipCount: number;
  keyword: string;
  addressInfos: { chainId: string; address: string }[];
}): Promise<{ data: IAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountAssetsByKeywords({
    params: {
      addressInfos,
      skipCount,
      maxResultCount,
      keyword,
      width: NFT_SMALL_SIZE,
      height: -1,
    },
  });
}

export function fetchAssetListV2({
  addressInfos,
  maxResultCount = 1000,
  skipCount = 0,
  keyword = '',
}: {
  maxResultCount?: number;
  skipCount?: number;
  keyword: string;
  addressInfos: { chainId: string; address: string }[];
}): Promise<{ nftInfos: IAssetNftCollection[]; tokenInfos: IAssetToken[]; totalRecordCount: number }> {
  console.log('fetchAccountAssetsByKeywordsV2');
  return request.assets.fetchAccountAssetsByKeywordsV2({
    params: {
      addressInfos,
      skipCount,
      maxResultCount,
      keyword,
      width: NFT_SMALL_SIZE,
      height: -1,
    },
  });
}

export function fetchCryptoBoxAssetList({
  addressInfos,
  maxResultCount,
  skipCount,
  keyword = '',
}: {
  maxResultCount: number;
  skipCount: number;
  keyword: string;
  addressInfos: { chainId: string; address: string }[];
}): Promise<{ data: ICryptoBoxAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchCryptoBoxAccountAssetsByKeywords({
    params: {
      addressInfos,
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
  addressInfos,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  skipCount: number;
  maxResultCount?: number;
  addressInfos: { chainId: string; address: string }[];
}): Promise<{ data: any[]; totalRecordCount: number; totalNftItemCount: number }> {
  console.log('fetch nft list!!');
  return request.assets.fetchAccountNftCollectionList({
    params: {
      addressInfos,
      skipCount,
      maxResultCount,
      width: NFT_MIDDLE_X_SIZE,
      height: -1,
    },
  });
}

export function fetchNFTList({
  symbol,
  addressInfos,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  symbol: string;
  addressInfos: { chainId: string; address: string }[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: NFTItemBaseType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionItemList({
    params: { addressInfos, symbol, skipCount, maxResultCount, width: NFT_MIDDLE_SIZE, height: -1 },
  });
}

export function fetchNFTItem({
  symbol,
  addressInfos,
}: {
  symbol: string;
  addressInfos: { chainId: string; address: string }[];
}): Promise<{ data: NFTItemBaseType }> {
  return request.assets.fetchAccountNftCollectionItem({
    params: { addressInfos, symbol, width: NFT_LARGE_SIZE, height: -1 },
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
  currentCaAddress: address,
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
      address,
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
  addressInfos,
}: {
  addressInfos: { chainId: string; address: string }[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: ITokenAllowance[]; totalRecordCount: number }> {
  return request.assets.fetchTokenAllowanceList({
    params: { addressInfos, skipCount, maxResultCount },
  });
}
