import { useCallback, useMemo } from 'react';
// import { useAppEOASelector } from './index';
// import { useCaAddressInfoList } from './wallet';
import { ChainId } from '@portkey-wallet/types';
import { useAppEOASelector } from '../index';
import { useCurrentNetworkInfo, useIsMainnet } from '../network';
import {
  fetchNFTAsync,
  fetchNFTCollectionsAsync,
  fetchTokenListAsync,
  INIT_ACCOUNT_NFT_INFO,
  INIT_ACCOUNT_TOKEN_INFO,
} from '@portkey-wallet/store/store-eoa/assets/slice';
import { useAppCommonDispatch } from '../..';
import { useCurrentAddressInfos, useUniqueIdentify } from '../wallet';

export const useAssets = () => useAppEOASelector(state => state.assets);

// export function useNFTItemDetail() {
//   const addressInfos = useCaAddressInfoList();

//   return useCallback(
//     async ({ symbol, chainId }: { symbol: string; chainId: ChainId }) => {
//       const caAddressInfo = addressInfos.filter(item => item.chainId === chainId);
//       return fetchNFTItem({ addressInfos: caAddressInfo, symbol });
//     },
//     [addressInfos],
//   );
// }

// export const useAccountAssetsInfo = () => {
//   const dispatch = useAppCommonDispatch();
//   const currentNetworkInfo = useCurrentNetworkInfo();
//   const assetsState = useAssets();
//   const accountAssetsInfo = useMemo(
//     () => assetsState.accountAssets.accountAssetsInfo?.[currentNetworkInfo.networkType] || INIT_ACCOUNT_ASSETS_INFO,
//     [assetsState.accountAssets.accountAssetsInfo, currentNetworkInfo.networkType],
//   );

//   const fetchAccountAssetsInfoList = useCallback(
//     (params: {
//       keyword: string;
//       addressInfos: { chainId: ChainId; address: string }[];
//       skipCount?: number;
//       maxResultCount?: number;
//     }) => {
//       return dispatch(
//         fetchAssetAsync({
//           ...params,
//           currentNetwork: currentNetworkInfo.networkType,
//         }),
//       );
//     },
//     [currentNetworkInfo.networkType, dispatch],
//   );

//   return { ...accountAssetsInfo, fetchAccountAssetsInfoList, isFetching: assetsState.accountAssets.isFetching };
// };

// export const useAccountAssetsInfoV2 = () => {
//   const dispatch = useAppCommonDispatch();
//   const currentNetworkInfo = useCurrentNetworkInfo();
//   const assetsState = useAssets();
//   const accountAssetsInfo = useMemo(
//     () =>
//       assetsState.accountAssetsV2?.accountAssetsInfo?.[currentNetworkInfo.networkType] || INIT_ACCOUNT_ASSETS_INFO_V2,
//     [assetsState.accountAssetsV2?.accountAssetsInfo, currentNetworkInfo.networkType],
//   );

//   const fetchAccountAssetsInfoList = useCallback(
//     (params: {
//       keyword: string;
//       addressInfos: { chainId: ChainId; address: string }[];
//       skipCount?: number;
//       maxResultCount?: number;
//     }) => {
//       return dispatch(
//         fetchAssetV2Async({
//           ...params,
//           currentNetwork: currentNetworkInfo.networkType,
//         }),
//       );
//     },
//     [currentNetworkInfo.networkType, dispatch],
//   );

//   return { ...accountAssetsInfo, fetchAccountAssetsInfoList, isFetching: assetsState.accountAssetsV2?.isFetching };
// };

export const useAccountTokenInfo = () => {
  const dispatch = useAppCommonDispatch();
  const identify = useUniqueIdentify();

  // const currentNetwork = useCurrentNetwork();
  const assetsState = useAssets();
  const accountTokenInfo = useMemo(
    () => assetsState?.accountToken?.accountTokenInfoV2?.[identify] || INIT_ACCOUNT_TOKEN_INFO,
    [assetsState?.accountToken?.accountTokenInfoV2, identify],
  );
  const fetchAccountTokenInfoList = useCallback(
    (params: {
      addressInfos: { chainId: ChainId; address: string }[];
      skipCount?: number;
      maxResultCount?: number;
      isInit?: boolean;
    }) => {
      return dispatch(
        fetchTokenListAsync({
          ...params,
          identify: identify,
        }),
      );
    },
    [identify, dispatch],
  );

  return { ...accountTokenInfo, fetchAccountTokenInfoList, isFetching: assetsState?.accountToken?.isFetching };
};
export const useAccountBalanceUSD = () => {
  const identify = useUniqueIdentify();
  const assetsState = useAssets();
  return useMemo(
    () => assetsState?.accountBalance?.accountBalanceInfo?.[identify] || '',
    [assetsState?.accountBalance?.accountBalanceInfo, identify],
  );
};

export const useAccountNFTCollectionInfo = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const identify = useUniqueIdentify();
  const assetsState = useAssets();
  const accountNFTCollectionInfo = useMemo(
    () => assetsState?.accountNFT?.accountNFTInfo?.[identify] || INIT_ACCOUNT_NFT_INFO,
    [assetsState?.accountNFT?.accountNFTInfo, identify],
  );

  const fetchAccountNFTCollectionInfoList = useCallback(
    (params: {
      addressInfos: { chainId: ChainId; address: string }[];
      maxNFTCount?: number;
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      return dispatch(
        fetchNFTCollectionsAsync({
          ...params,
          identify,
        }),
      );
    },
    [identify, dispatch],
  );

  const fetchAccountNFTItem = useCallback(
    (params: {
      symbol: string;
      addressInfos: { chainId: ChainId; address: string }[];
      chainId: ChainId;
      pageNum: number;
    }) => {
      return dispatch(
        fetchNFTAsync({
          ...params,
          identify: identify,
        }),
      );
    },
    [identify, dispatch],
  );

  return {
    ...accountNFTCollectionInfo,
    fetchAccountNFTCollectionInfoList,
    fetchAccountNFTItem,
    isFetching: assetsState?.accountNFT?.isFetching,
  };
};

export const useTokenInfoFromStore = (symbol: string, chainId: ChainId) => {
  const { accountTokenList } = useAccountTokenInfo();
  return useMemo(() => {
    const _target = accountTokenList?.find(ele => ele.symbol === symbol);
    const _token = _target?.tokens?.find(ele => ele.chainId === chainId);
    return _token;
  }, [accountTokenList, chainId, symbol]);
};

export function useFetchTokenAllowanceList() {
  const isMainnet = useIsMainnet();
  const addressInfos = useCurrentAddressInfos();

  // return useCallback(
  //   async ({ skipCount, maxResultCount }: { skipCount: number; maxResultCount: number }) => {
  //     return fetchTokenAllowanceList({ skipCount, maxResultCount, addressInfos });
  //   },
  //   [addressInfos],
  // );
}