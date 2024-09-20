import { useCallback, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useCaAddressInfoList } from './wallet';
import { fetchNFTItem, fetchTokenAllowanceList } from '@portkey-wallet/store/store-ca/assets/api';
import { ChainId } from '@portkey-wallet/types';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetworkInfo } from './network';
import {
  fetchAssetAsync,
  fetchNFTAsync,
  fetchNFTCollectionsAsync,
  fetchTokenListAsync,
  INIT_ACCOUNT_ASSETS_INFO,
  INIT_ACCOUNT_NFT_INFO,
  INIT_ACCOUNT_TOKEN_INFO,
} from '@portkey-wallet/store/store-ca/assets/slice';

export const useAssets = () => useAppCASelector(state => state.assets);

export function useNFTItemDetail() {
  const caAddressInfos = useCaAddressInfoList();

  return useCallback(
    async ({ symbol, chainId }: { symbol: string; chainId: ChainId }) => {
      const caAddressInfo = caAddressInfos.filter(item => item.chainId === chainId);
      return fetchNFTItem({ caAddressInfos: caAddressInfo, symbol });
    },
    [caAddressInfos],
  );
}

export const useAccountAssetsInfo = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const assetsState = useAssets();
  const accountAssetsInfo = useMemo(
    () => assetsState.accountAssets.accountAssetsInfo?.[currentNetworkInfo.networkType] || INIT_ACCOUNT_ASSETS_INFO,
    [assetsState.accountAssets.accountAssetsInfo, currentNetworkInfo.networkType],
  );

  const fetchAccountAssetsInfoList = useCallback(
    (params: {
      keyword: string;
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      return dispatch(
        fetchAssetAsync({
          ...params,
          currentNetwork: currentNetworkInfo.networkType,
        }),
      );
    },
    [currentNetworkInfo.networkType, dispatch],
  );

  return { ...accountAssetsInfo, fetchAccountAssetsInfoList, isFetching: assetsState.accountAssets.isFetching };
};

export const useAccountTokenInfo = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const assetsState = useAssets();
  const accountTokenInfo = useMemo(
    () => assetsState.accountToken.accountTokenInfoV2?.[currentNetworkInfo.networkType] || INIT_ACCOUNT_TOKEN_INFO,
    [assetsState.accountToken.accountTokenInfoV2, currentNetworkInfo.networkType],
  );

  const fetchAccountTokenInfoList = useCallback(
    (params: {
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      skipCount?: number;
      maxResultCount?: number;
      isInit?: boolean;
    }) => {
      return dispatch(
        fetchTokenListAsync({
          ...params,
          currentNetwork: currentNetworkInfo.networkType,
        }),
      );
    },
    [currentNetworkInfo.networkType, dispatch],
  );

  return { ...accountTokenInfo, fetchAccountTokenInfoList, isFetching: assetsState.accountToken.isFetching };
};

export const useAccountNFTCollectionInfo = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const assetsState = useAssets();
  const accountNFTCollectionInfo = useMemo(
    () => assetsState.accountNFT.accountNFTInfo?.[currentNetworkInfo.networkType] || INIT_ACCOUNT_NFT_INFO,
    [assetsState.accountNFT.accountNFTInfo, currentNetworkInfo.networkType],
  );

  const fetchAccountNFTCollectionInfoList = useCallback(
    (params: {
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      maxNFTCount?: number;
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      return dispatch(
        fetchNFTCollectionsAsync({
          ...params,
          currentNetwork: currentNetworkInfo.networkType,
        }),
      );
    },
    [currentNetworkInfo.networkType, dispatch],
  );

  const fetchAccountNFTItem = useCallback(
    (params: {
      symbol: string;
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      chainId: ChainId;
      pageNum: number;
    }) => {
      return dispatch(
        fetchNFTAsync({
          ...params,
          currentNetwork: currentNetworkInfo.networkType,
        }),
      );
    },
    [currentNetworkInfo.networkType, dispatch],
  );

  return {
    ...accountNFTCollectionInfo,
    fetchAccountNFTCollectionInfoList,
    fetchAccountNFTItem,
    isFetching: assetsState.accountNFT.isFetching,
  };
};

export const useTokenInfoFromStore = (symbol: string, chainId: ChainId) => {
  const { accountTokenList } = useAccountTokenInfo();
  return useMemo(() => {
    const _target = accountTokenList?.find(ele => ele.symbol === symbol);
    const _token = _target?.tokens?.find(ele => ele.chainId === chainId);
    return {
      ..._target,
      ..._token,
    };
  }, [accountTokenList, chainId, symbol]);
};

export function useFetchTokenAllowanceList() {
  const caAddressInfos = useCaAddressInfoList();

  return useCallback(
    async ({ skipCount, maxResultCount }: { skipCount: number; maxResultCount: number }) => {
      return fetchTokenAllowanceList({ skipCount, maxResultCount, caAddressInfos });
    },
    [caAddressInfos],
  );
}
