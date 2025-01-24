import { useAppCommonDispatch, useAppEOASelector } from '../index';
import {
  fetchAllTokenListAsync,
  fetchAllTokenListV2Async,
  getSymbolImagesAsync,
} from '@portkey-wallet/store/store-eoa/tokenManagement/action';
import { useMemo, useCallback, useEffect } from 'react';
import { INITIAL_TOKEN_INFO } from '@portkey-wallet/store/store-eoa/tokenManagement/slice';
import { useAccountTokenInfo } from './assets';
import { useUniqueIdentify } from './wallet';

export const useToken = () => {
  const dispatch = useAppCommonDispatch();
  const identify = useUniqueIdentify();

  const tokenState = useAppEOASelector(state => state.tokenManagement);
  console.log('tokenState?.tokenInfoV2=====', JSON.stringify(tokenState?.tokenInfoV2));
  const tokenInfo = useMemo(
    () => tokenState?.tokenInfoV2?.[identify] || INITIAL_TOKEN_INFO,
    [identify, tokenState?.tokenInfoV2],
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

  const tokenState = useAppEOASelector(state => state.tokenManagement);

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
