import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useAppCommonDispatch } from '../index';
import {
  useCurrentNetworkInfo,
  useIsIMServiceExist,
  useIsMainnet,
  useNetworkList,
} from '@portkey-wallet/hooks/hooks-ca/network';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getBuyButtonAsync,
  getRememberMeBlackListAsync,
  getTabMenuAsync,
  getEntranceControlAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';
import { BuyButtonType } from '@portkey-wallet/store/store-ca/cms/types';
import { getFaviconUrl, getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { checkSiteIsInBlackList } from '@portkey-wallet/utils/session';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';

export const useCMS = () => useAppCASelector(state => state.cms);
export const useEntranceControlNetMap = () => useAppCASelector(state => state.cms.entranceControlNetMap);

export function useTabMenuList(isInit = false) {
  const dispatch = useAppCommonDispatch();
  const { tabMenuListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const tabMenuList = useMemo(() => tabMenuListNetMap[networkType] || [], [networkType, tabMenuListNetMap]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getTabMenuAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getTabMenuAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return tabMenuList;
}

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

export const useBuyButtonShow = (deviceType: VersionDeviceType) => {
  const buyButton = useBuyButton();
  const { networkType } = useCurrentNetworkInfo();
  const isMainnet = useIsMainnet();
  const dispatch = useAppCommonDispatch();

  const getIsBuySectionShow = useCallback(
    (isMainnet: boolean, buyButton: BuyButtonType | undefined, deviceType: VersionDeviceType) => {
      if (!isMainnet) return false;
      switch (deviceType) {
        case VersionDeviceType.iOS:
          return buyButton?.isIOSBuyShow || false;
        case VersionDeviceType.Android:
          return buyButton?.isAndroidBuyShow || false;
        case VersionDeviceType.Extension:
          return buyButton?.isExtensionBuyShow || false;
        default:
          return false;
      }
    },
    [],
  );

  const getIsSellSectionShow = useCallback(
    (isMainnet: boolean, buyButton: BuyButtonType | undefined, deviceType: VersionDeviceType) => {
      if (!isMainnet) return false;
      switch (deviceType) {
        case VersionDeviceType.iOS:
          return buyButton?.isIOSSellShow || false;
        case VersionDeviceType.Android:
          return buyButton?.isAndroidSellShow || false;
        case VersionDeviceType.Extension:
          return buyButton?.isExtensionSellShow || false;
        default:
          return false;
      }
    },
    [],
  );

  const isBuySectionShow = useMemo(
    () => getIsBuySectionShow(isMainnet, buyButton, deviceType),
    [buyButton, deviceType, getIsBuySectionShow, isMainnet],
  );

  const isSellSectionShow = useMemo(
    () => getIsSellSectionShow(isMainnet, buyButton, deviceType),
    [buyButton, deviceType, getIsSellSectionShow, isMainnet],
  );

  const isBuyButtonShow = useMemo(
    () => isMainnet && (isBuySectionShow || isSellSectionShow || false),
    [isBuySectionShow, isMainnet, isSellSectionShow],
  );

  const refreshBuyButton = useCallback(async () => {
    const result = await dispatch(getBuyButtonAsync(networkType));
    const buyButtonResult: BuyButtonType | undefined = result?.payload?.buyButtonNetMap?.[networkType];

    return {
      isBuySectionShow: getIsBuySectionShow(isMainnet, buyButtonResult, deviceType),
      isSellSectionShow: getIsSellSectionShow(isMainnet, buyButtonResult, deviceType),
    };
  }, [deviceType, dispatch, getIsBuySectionShow, getIsSellSectionShow, isMainnet, networkType]);

  return {
    isBuyButtonShow,
    isBuySectionShow,
    isSellSectionShow,
    refreshBuyButton,
  };
};

export const useEntranceControl = (isInit = false) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const entranceControlNetMap = useEntranceControlNetMap();

  const entranceControl = useMemo(() => entranceControlNetMap?.[networkType], [entranceControlNetMap, networkType]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        dispatch(getEntranceControlAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getEntranceControlAsync(networkType));
    }
  }, [dispatch, isInit, networkType]);

  const refresh = useCallback(async () => {
    return dispatch(getEntranceControlAsync(networkType));
  }, [dispatch, networkType]);

  return {
    entranceControl,
    refresh,
  };
};

export const useIsBridgeShow = (deviceType: VersionDeviceType) => {
  const { entranceControl } = useEntranceControl();
  return useMemo(() => {
    switch (deviceType) {
      case VersionDeviceType.iOS:
        return entranceControl?.isIOSBridgeShow || false;
      case VersionDeviceType.Android:
        return entranceControl?.isAndroidBridgeShow || false;
      case VersionDeviceType.Extension:
        return entranceControl?.isExtensionBridgeShow || false;
      default:
        return false;
    }
  }, [
    deviceType,
    entranceControl?.isAndroidBridgeShow,
    entranceControl?.isExtensionBridgeShow,
    entranceControl?.isIOSBridgeShow,
  ]);
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

export const useFetchCurrentRememberMeBlackList = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  return useCallback(() => {
    dispatch(getRememberMeBlackListAsync(networkType));
  }, [dispatch, networkType]);
};

export const useCheckSiteIsInBlackList = () => {
  const list = useRememberMeBlackList();
  return useCallback((url: string) => checkSiteIsInBlackList(list, getOrigin(url)), [list]);
};

export const useIsChatShow = () => {
  const { tabMenuListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const isIMServiceExist = useIsIMServiceExist();

  const IsChatShow = useMemo(() => {
    const tabMenuList = tabMenuListNetMap[networkType];
    if (!tabMenuList) return false;
    return isIMServiceExist && !!tabMenuList.find(item => item.type.value === ChatTabName);
  }, [isIMServiceExist, networkType, tabMenuListNetMap]);

  return IsChatShow;
};

export const useGetCmsWebsiteInfo = () => {
  const { cmsWebsiteMap } = useCMS();
  const { s3Url } = useCurrentNetworkInfo();

  const getCmsWebsiteInfoImageUrl = useCallback(
    (domain: string): string => {
      const target = cmsWebsiteMap?.[domain];

      // if in cms
      if (target?.imgUrl) {
        return `${s3Url}/${target?.imgUrl?.filename_disk}`;
      } else {
        return getFaviconUrl(domain);
      }
    },
    [cmsWebsiteMap, s3Url],
  );

  const getCmsWebsiteInfoName = useCallback(
    (domain: string) => {
      const target = cmsWebsiteMap?.[domain];

      if (target?.title) {
        return target?.title || '';
      }
      return '';
    },
    [cmsWebsiteMap],
  );

  return {
    getCmsWebsiteInfoImageUrl,
    getCmsWebsiteInfoName,
  };
};
