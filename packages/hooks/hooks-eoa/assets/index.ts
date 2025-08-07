import { useCallback, useMemo } from 'react';
// import { useAppEOASelector } from './index';
// import { useCaAddressInfoList } from './wallet';
import { ChainId } from '@portkey-wallet/types';
import { useAppEOASelector } from '../index';
// import { useCurrentNetworkInfo, useIsMainnet } from '../network';
import {
  showLocalShowTokenInfo,
  fetchNFTAsync,
  fetchNFTCollectionsAsync,
  fetchTokenListAsync,
  INIT_ACCOUNT_NFT_INFO,
  INIT_ACCOUNT_TOKEN_INFO,
  hideLocalShowTokenInfo,
  fetchAssetV2Async,
  INIT_ACCOUNT_ASSETS_INFO_V2,
} from '@portkey-wallet/store/store-eoa/assets/slice';
import { useAppCommonDispatch } from '../..';
import { useCurrentAddressInfos, useUniqueIdentify } from '../wallet';
import { IUserTokenItem, TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { fetchNFTItem } from '@portkey-wallet/store/store-eoa/assets/api';
import cloneDeep from 'lodash/cloneDeep';
export const useAssets = () => useAppEOASelector(state => state.assets);

export function useNFTItemDetail() {
  const addressInfos = useCurrentAddressInfos();

  return useCallback(
    async ({ symbol, chainId }: { symbol: string; chainId: ChainId }) => {
      const addressInfo = addressInfos.filter(item => item.chainId === chainId);
      return fetchNFTItem({ addressInfos: addressInfo, symbol });
    },
    [addressInfos],
  );
}

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
  // console.log('assetsState====', JSON.stringify(assetsState));
  const accountTokenInfo = useMemo(
    () => assetsState?.accountToken?.accountTokenInfoV2?.[identify] || INIT_ACCOUNT_TOKEN_INFO,
    [assetsState?.accountToken?.accountTokenInfoV2, identify],
  );
  const updatedAccountTokenList = useAccountTokenInfoMixLocalShowToken();
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

  return {
    ...accountTokenInfo,
    accountTokenList: updatedAccountTokenList,
    fetchAccountTokenInfoList,
    isFetching: assetsState?.accountToken?.isFetching,
  };
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
  // const currentNetworkInfo = useCurrentNetworkInfo();
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

// export function useFetchTokenAllowanceList() {
// const isMainnet = useIsMainnet();
// const addressInfos = useCurrentAddressInfos();

// return useCallback(
//   async ({ skipCount, maxResultCount }: { skipCount: number; maxResultCount: number }) => {
//     return fetchTokenAllowanceList({ skipCount, maxResultCount, addressInfos });
//   },
//   [addressInfos],
// );
// }

export function useManagerTokenInfo() {
  const dispatch = useAppCommonDispatch();
  const identify = useUniqueIdentify();
  const { localShowTokenInfo } = useAssets();
  const showToken = useCallback(
    (token: IUserTokenItem) => {
      dispatch(
        showLocalShowTokenInfo({
          identify,
          token,
        }),
      );
    },
    [dispatch, identify],
  );

  const hideToken = useCallback(
    (token: IUserTokenItem) => {
      dispatch(
        hideLocalShowTokenInfo({
          identify,
          token,
        }),
      );
    },
    [dispatch, identify],
  );
  const switchToken = useCallback(
    (item: TokenItemShowType, isDisplay: boolean) => {
      console.log('item is::', item, 'isDisplay', isDisplay);
      if (isDisplay) {
        showToken(item as IUserTokenItem);
      } else {
        hideToken(item as IUserTokenItem);
      }
    },
    [hideToken, showToken],
  );
  return {
    showToken,
    hideToken,
    switchToken,
    localToken: localShowTokenInfo?.[identify],
  };
}

export function useOriginAccountTokenList() {
  const identify = useUniqueIdentify();
  const assetsState = useAssets();
  const accountTokenInfo = useMemo(
    () => assetsState?.accountToken?.accountTokenInfoV2?.[identify] || INIT_ACCOUNT_TOKEN_INFO,
    [assetsState?.accountToken?.accountTokenInfoV2, identify],
  );
  return useMemo(() => accountTokenInfo.accountTokenList, [accountTokenInfo.accountTokenList]);
}

export function useAccountTokenInfoMixLocalShowToken() {
  // const { accountTokenList } = useAccountTokenInfo();
  const identify = useUniqueIdentify();
  const assetsState = useAssets();
  const accountTokenInfo = useMemo(
    () => assetsState?.accountToken?.accountTokenInfoV2?.[identify] || INIT_ACCOUNT_TOKEN_INFO,
    [assetsState?.accountToken?.accountTokenInfoV2, identify],
  );
  const updatedAccountTokenList = useMemo(() => {
    const originAccountTokenList = accountTokenInfo.accountTokenList;
    if (!originAccountTokenList) return;
    let newAccountTokenList = cloneDeep(originAccountTokenList);
    const localShowTokenInfo = assetsState.localShowTokenInfo?.[identify];
    localShowTokenInfo
      ?.filter(item => item.isAdded)
      .forEach(localAddedToken => {
        const funded = newAccountTokenList?.find(innerItem => innerItem.symbol === localAddedToken.symbol);
        if (funded) {
          if (!funded.tokens) funded.tokens = [];
          const index = funded.tokens?.findIndex(token => token.chainId === localAddedToken.chainId);
          console.log('===index', index, 'funded.tokens===', funded.tokens);
          if (index !== -1) {
            console.log('if===');
            funded.tokens[index] = { ...funded.tokens[index], ...localAddedToken };
          } else {
            console.log('else===');
            // funded.tokens.push(localAddedToken);
            const updatedTokens = [...funded.tokens, localAddedToken];
            const updatedFunded = {
              ...funded,
              tokens: updatedTokens,
            };
            newAccountTokenList = newAccountTokenList.map(item =>
              item.symbol === localAddedToken.symbol ? updatedFunded : item,
            );
          }
        } else {
          newAccountTokenList?.push({
            symbol: localAddedToken.symbol,
            price: Number(localAddedToken.price) || 0,
            balance: localAddedToken.balance || '0',
            decimals: Number(localAddedToken.decimals) || 0,
            balanceInUsd: localAddedToken.balanceInUsd || '0',
            // tokenContractAddress: '',
            label: localAddedToken.label || '',
            imageUrl: localAddedToken.imageUrl,
            displayStatus: 'Partial',
            tokens: [localAddedToken],
            // isAdded: token.isAdded,
          });
        }
      });
    // remove isAdded false
    localShowTokenInfo
      ?.filter(item => !item.isAdded)
      .forEach(hiddenLocalToken => {
        const funded = newAccountTokenList?.find(innerItem => innerItem.symbol === hiddenLocalToken.symbol);
        if (funded && funded.tokens) {
          const index = funded.tokens?.findIndex(token => token.chainId === hiddenLocalToken.chainId);
          if (index !== -1 && index !== undefined) {
            // console.log(
            //   '===index',
            //   index,
            //   'hiddenLocalToken===',
            //   hiddenLocalToken,
            //   'funded.tokens===',
            //   funded.tokens?.length,
            // );
            // funded.tokens?.splice(index, 1);
            const updatedTokens = [...funded.tokens.slice(0, index), ...funded.tokens.slice(index + 1)];
            const updatedFunded = {
              ...funded,
              tokens: updatedTokens,
            };
            const updatedNewAccountTokenList = newAccountTokenList.map(item =>
              item.symbol === hiddenLocalToken.symbol ? updatedFunded : item,
            );
            newAccountTokenList = updatedNewAccountTokenList;
          }
        }
      });
    const updatedNewAccountTokenList = newAccountTokenList.filter(item => item.tokens && item.tokens.length > 0);
    return updatedNewAccountTokenList;
  }, [accountTokenInfo.accountTokenList, assetsState.localShowTokenInfo, identify]);
  return updatedAccountTokenList;
}

export const useAccountAssetsInfoV2 = () => {
  const dispatch = useAppCommonDispatch();
  // const currentNetworkInfo = useCurrentNetworkInfo();
  const assetsState = useAssets();
  const identify = useUniqueIdentify();
  const accountAssetsInfo = useMemo(
    () => assetsState.accountAssetsV2?.accountAssetsInfo?.[identify] || INIT_ACCOUNT_ASSETS_INFO_V2,
    [assetsState.accountAssetsV2?.accountAssetsInfo, identify],
  );

  const fetchAccountAssetsInfoList = useCallback(
    (params: {
      keyword: string;
      addressInfos: { chainId: ChainId; address: string }[];
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      return dispatch(
        fetchAssetV2Async({
          ...params,
          identify: identify,
        }),
      );
    },
    [identify, dispatch],
  );

  return { ...accountAssetsInfo, fetchAccountAssetsInfoList, isFetching: assetsState.accountAssetsV2?.isFetching };
};
