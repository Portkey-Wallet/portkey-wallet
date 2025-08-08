import { useAppCommonDispatch, useAppEOASelector } from '../index';
import {
  fetchAllTokenListAsync,
  // fetchAllTokenListV2Async,
  getSymbolImagesAsync,
} from '@portkey-wallet/store/store-eoa/tokenManagement/action';
import { useMemo, useCallback, useEffect } from 'react';
import { INITIAL_TOKEN_INFO } from '@portkey-wallet/store/store-eoa/tokenManagement/slice';
import {
  useAccountTokenInfo,
  useAccountTokenInfoMixLocalShowToken,
  // useAssets,
  useManagerTokenInfo,
} from './assets';
import { useUniqueIdentify } from './wallet';

export const useToken = () => {
  const dispatch = useAppCommonDispatch();
  const identify = useUniqueIdentify();

  const tokenState = useAppEOASelector(state => state.tokenManagement);
  console.log('tokenState?.tokenInfoV2=====', JSON.stringify(tokenState?.tokenInfo));
  const tokenInfo = useMemo(
    () => tokenState?.tokenInfo?.[identify] || INITIAL_TOKEN_INFO,
    [identify, tokenState?.tokenInfo],
  );

  const fetchTokenInfoList = useCallback(
    (params: { keyword: string; chainIdArray: string[]; skipCount?: number; maxResultCount?: number }) => {
      return dispatch(
        fetchAllTokenListAsync({
          ...params,
          identify,
        }),
      );
    },
    [identify, dispatch],
  );
  return { ...tokenInfo, fetchTokenInfoList, isFetching: tokenState.isFetching };
};
export const useTokenLegacy = () => {
  const dispatch = useAppCommonDispatch();
  const identify = useUniqueIdentify();
  console.log('identify is:: =====', identify);
  const updatedAccountTokenList = useAccountTokenInfoMixLocalShowToken();
  const { localToken } = useManagerTokenInfo();
  const tokenState = useAppEOASelector(state => state.tokenManagement);

  const tokenInfo = useMemo(
    () => tokenState?.tokenInfo?.[identify] || INITIAL_TOKEN_INFO,
    [identify, tokenState?.tokenInfo],
  );
  const updatedTokenDataShowInMarket = useMemo(() => {
    console.log('tokenInfo.tokenDataShowInMarket', JSON.stringify(tokenInfo.tokenDataShowInMarket));
    const flattenedAccountTokens = updatedAccountTokenList?.flatMap(item => item.tokens);
    console.log('flattenedAccountTokens====', JSON.stringify(flattenedAccountTokens));
    const updatedMarketTokens = tokenInfo.tokenDataShowInMarket.map(token => ({
      ...token,
      isAdded: flattenedAccountTokens?.some(item1 => item1?.symbol === token.symbol && item1.chainId === token.chainId),
    }));

    flattenedAccountTokens?.forEach(token => {
      if (
        token &&
        !updatedMarketTokens.some(
          marketToken => marketToken.symbol === token.symbol && marketToken.chainId === token.chainId,
        )
      ) {
        updatedMarketTokens.push({ ...token, isAdded: true });
      }
    });
    localToken
      ?.filter(item => !item.isAdded)
      .forEach(item => {
        const isInList = updatedMarketTokens?.some(
          flattedItem => flattedItem?.symbol === item.symbol && flattedItem.chainId === item.chainId,
        );
        if (!isInList) {
          updatedMarketTokens?.push({ ...item, isAdded: false });
        }
      });
    return updatedMarketTokens;
  }, [tokenInfo.tokenDataShowInMarket, updatedAccountTokenList, localToken]);
  const fetchTokenInfoList = useCallback(
    (params: { keyword: string; chainIdArray: string[]; skipCount?: number; maxResultCount?: number }) => {
      return dispatch(
        fetchAllTokenListAsync({
          ...params,
          identify,
        }),
      );
    },
    [identify, dispatch],
  );
  return {
    ...tokenInfo,
    tokenDataShowInMarket: updatedTokenDataShowInMarket,
    fetchTokenInfoList,
    isFetching: tokenState.isFetching,
  };
};
export const useFetchSymbolImages = () => {
  const dispatch = useAppCommonDispatch();

  useEffect(() => {
    dispatch(getSymbolImagesAsync());
  }, [dispatch]);
};

export const useSymbolImages = () => {
  const { symbolImages } = useAppEOASelector(state => state.tokenManagement);
  return useMemo(() => symbolImages, [symbolImages]);
};

export function useSymbolList(): string[] {
  const { accountTokenList } = useAccountTokenInfo();

  return useMemo(() => {
    return Array.from(new Set(accountTokenList?.map(item => item.symbol)));
  }, [accountTokenList]);
}

export default useToken;
