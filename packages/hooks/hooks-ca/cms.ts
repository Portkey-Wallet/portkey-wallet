import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getBuyButtonAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';

export const useCMS = () => useAppCASelector(state => state.cms);

export function useSocialMediaList(isInit = false) {
  const dispatch = useAppCommonDispatch();
  const { socialMediaListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const socialMediaList = useMemo(() => socialMediaListNetMap[networkType] || [], [networkType, socialMediaListNetMap]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getSocialMediaAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getSocialMediaAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return socialMediaList;
}

export function useDiscoverGroupList(isInit = false) {
  const dispatch = useAppCommonDispatch();
  const { discoverGroupListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const discoverGroupList = useMemo(
    () => discoverGroupListNetMap[networkType] || [],
    [networkType, discoverGroupListNetMap],
  );

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getDiscoverGroupAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getDiscoverGroupAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return discoverGroupList;
}

export const useBuyButton = (isInit = false) => {
  const dispatch = useAppCommonDispatch();
  const { buyButtonNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const buyButtonNet = useMemo(() => buyButtonNetMap?.[networkType] || undefined, [networkType, buyButtonNetMap]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getBuyButtonAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getBuyButtonAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return buyButtonNet;
};

export const useBuyButtonShow = () => {
  const buyButton = useBuyButton();
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const isBuyButtonShow = useMemo(() => {
    buyButton?.isBuySectionShow || buyButton?.isSellSectionShow;
  }, [buyButton]);

  const refreshBuyButton = useCallback(async () => {
    const result = await dispatch(getBuyButtonAsync(networkType));
    console.log(result);
    return result;
  }, [dispatch, networkType]);

  return {
    isBuyButtonShow,
    isBuySectionShow: buyButton?.isBuySectionShow || false,
    isSellSectionShow: buyButton?.isSellSectionShow || false,
    refreshBuyButton,
  };
};
