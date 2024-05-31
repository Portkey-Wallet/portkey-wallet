import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '../index';
import {
  TBaseCardItemType,
  THomeBannerList,
  TDiscoverDappBannerList,
  TDiscoverLearnBannerList,
} from '@portkey-wallet/types/types-ca/cms';
import { useCurrentNetworkInfo, useNetworkList } from '../network';
import { ChainId } from '@portkey-wallet/types';
import { useAppCommonDispatch } from '../..';
import {
  getDiscoverDappBannerAsync,
  getDiscoverLearnBannerAsync,
  getHomeBannerListAsync,
  getTokenDetailBannerAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';

export const useCMS = () => useAppCASelector(state => state.cms);

export const useCmsBanner = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  const { homeBannerListMap, discoverDappBannerListMap, discoverLearnBannerListMap, tokenDetailBannerListMap } =
    useCMS();

  const homeBannerList = useMemo<THomeBannerList>(
    () => homeBannerListMap?.[networkType] || [],
    [homeBannerListMap, networkType],
  );

  const dappBannerList = useMemo<TDiscoverDappBannerList>(
    () => discoverDappBannerListMap?.[networkType] || [],
    [discoverDappBannerListMap, networkType],
  );

  const learnBannerList = useMemo<TDiscoverLearnBannerList>(
    () => discoverLearnBannerListMap?.[networkType] || [],
    [discoverLearnBannerListMap, networkType],
  );

  const getTokenDetailBannerList = useCallback(
    (chainId: ChainId, symbol: string): TBaseCardItemType[] => {
      return (
        tokenDetailBannerListMap?.[networkType]?.find(
          ele =>
            ele.chainId?.toLocaleLowerCase() === chainId?.toLocaleLowerCase() &&
            ele.symbol?.toLocaleLowerCase() === symbol?.toLocaleLowerCase(),
        )?.items || []
      );
    },
    [networkType, tokenDetailBannerListMap],
  );

  const fetchHomeBannerListAsync = useCallback(
    () => dispatch(getHomeBannerListAsync(networkType)),
    [dispatch, networkType],
  );

  const fetchDiscoverDappBannerAsync = useCallback(
    () => dispatch(getDiscoverDappBannerAsync(networkType)),
    [dispatch, networkType],
  );

  const fetchTokenDetailBannerAsync = useCallback(
    () => dispatch(getTokenDetailBannerAsync(networkType)),
    [dispatch, networkType],
  );

  const fetchDiscoverLearnBannerAsync = useCallback(
    () => dispatch(getDiscoverLearnBannerAsync(networkType)),
    [dispatch, networkType],
  );

  return {
    homeBannerList,
    dappBannerList,
    learnBannerList,
    getTokenDetailBannerList,
    fetchHomeBannerListAsync,
    fetchDiscoverDappBannerAsync,
    fetchTokenDetailBannerAsync,
    fetchDiscoverLearnBannerAsync,
  };
};

export const useInitCmsBanner = () => {
  const dispatch = useAppCommonDispatch();
  const networkList = useNetworkList();

  useEffect(() => {
    networkList.forEach(item => {
      dispatch(getTokenDetailBannerAsync(item.networkType));
      dispatch(getHomeBannerListAsync(item.networkType));
      dispatch(getDiscoverDappBannerAsync(item.networkType));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
