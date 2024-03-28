import { useAppCASelector, useAppCommonDispatch } from '../index';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { useMemo, useCallback, useEffect } from 'react';
import { useCurrentNetworkInfo } from './network';
import { initialTokenInfo } from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import { useAccountTokenInfo } from './assets';

export const useToken = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();

  const tokenState = useAppCASelector(state => state.tokenManagement);

  const tokenInfo = useMemo(
    () => tokenState?.tokenInfo?.[currentNetworkInfo.networkType] || initialTokenInfo,
    [currentNetworkInfo.networkType, tokenState?.tokenInfo],
  );

  const fetchTokenInfoList = useCallback(
    async (params: { keyword: string; chainIdArray: string[]; skipCount?: number; maxResultCount?: number }) => {
      await dispatch(
        fetchAllTokenListAsync({
          ...params,
          currentNetwork: currentNetworkInfo.networkType,
        }),
      );
    },
    [currentNetworkInfo.networkType, dispatch],
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
  const { symbolImages } = useAppCASelector(state => state.tokenManagement);
  return useMemo(() => symbolImages, [symbolImages]);
};

export function useSymbolList(): string[] {
  const { accountTokenList } = useAccountTokenInfo();

  return useMemo(() => {
    return Array.from(new Set(accountTokenList?.map(item => item.symbol)));
  }, [accountTokenList]);
}

export default useToken;
