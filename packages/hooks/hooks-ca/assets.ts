import { useCallback, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useCaAddressInfoList } from './wallet';
import { fetchNFTItem } from '@portkey-wallet/store/store-ca/assets/api';
import { ChainId } from '@portkey-wallet/types';
import { useAppCommonDispatch } from '..';
import { useCurrentNetworkInfo } from './network';
import {
  fetchAssetAsync,
  fetchNFTAsync,
  fetchNFTCollectionsAsync,
  fetchTokenListAsync,
  initAccountAssetsInfo,
  initAccountNFTInfo,
  initAccountTokenInfo,
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
    () => assetsState.accountAssets.accountAssetsInfo?.[currentNetworkInfo.networkType] || initAccountAssetsInfo,
    [assetsState.accountAssets.accountAssetsInfo, currentNetworkInfo.networkType],
  );

  const fetchAccountAssetsInfoList = useCallback(
    async (params: {
      keyword: string;
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      await dispatch(
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
    () => assetsState.accountToken.accountTokenInfo?.[currentNetworkInfo.networkType] || initAccountTokenInfo,
    [assetsState.accountToken.accountTokenInfo, currentNetworkInfo.networkType],
  );

  const fetchAccountTokenInfoList = useCallback(
    async (params: {
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      await dispatch(
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
    () => assetsState.accountNFT.accountNFTInfo?.[currentNetworkInfo.networkType] || initAccountNFTInfo,
    [assetsState.accountNFT.accountNFTInfo, currentNetworkInfo.networkType],
  );

  const fetchAccountNFTCollectionInfoList = useCallback(
    async (params: {
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      maxNFTCount?: number;
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      await dispatch(
        fetchNFTCollectionsAsync({
          ...params,
          currentNetwork: currentNetworkInfo.networkType,
        }),
      );
    },
    [currentNetworkInfo.networkType, dispatch],
  );

  const fetchAccountNFTItem = useCallback(
    async (params: {
      symbol: string;
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      chainId: ChainId;
      pageNum: number;
    }) => {
      await dispatch(
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
