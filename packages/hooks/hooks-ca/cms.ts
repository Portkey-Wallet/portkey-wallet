import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useAppCommonDispatch } from '../index';
import { useCurrentNetworkInfo, useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getBuyButtonAsync,
  getRememberMeBlackListAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';
import { BuyButtonType } from '@portkey-wallet/store/store-ca/cms/types';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { checkSiteIsInBlackList } from '@portkey-wallet/utils/session';

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

  return discoverGroupList || [];
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
  const isMainnet = useIsMainnet();
  const dispatch = useAppCommonDispatch();

  const isBuyButtonShow = useMemo(
    () => isMainnet && (buyButton?.isBuySectionShow || buyButton?.isSellSectionShow || false),
    [buyButton?.isBuySectionShow, buyButton?.isSellSectionShow, isMainnet],
  );

  const isBuySectionShow = useMemo(
    () => isMainnet && (buyButton?.isBuySectionShow || false),
    [buyButton?.isBuySectionShow, isMainnet],
  );

  const isSellSectionShow = useMemo(
    () => isMainnet && (buyButton?.isSellSectionShow || false),
    [buyButton?.isSellSectionShow, isMainnet],
  );

  const refreshBuyButton = useCallback(async () => {
    const result = await dispatch(getBuyButtonAsync(networkType));
    const buyButtonResult: BuyButtonType = result?.payload?.buyButtonNetMap?.[networkType] || {
      isBuySectionShow: false,
      isSellSectionShow: false,
    };
    return buyButtonResult;
  }, [dispatch, networkType]);

  return {
    isBuyButtonShow,
    isBuySectionShow,
    isSellSectionShow,
    refreshBuyButton,
  };
};

export const useRememberMeBlackList = (isInit = false) => {
  const dispatch = useAppCommonDispatch();
  const { rememberMeBlackListMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const rememberMeBlackList = useMemo(
    () => rememberMeBlackListMap?.[networkType]?.map(ele => ele?.url) || [],
    [networkType, rememberMeBlackListMap],
  );

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getRememberMeBlackListAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getRememberMeBlackListAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return rememberMeBlackList || [];
};

export const useCheckSiteIsInBlackList = () => {
  const list = useRememberMeBlackList();
  return useCallback((url: string) => checkSiteIsInBlackList(list, getOrigin(url)), [list]);
};
