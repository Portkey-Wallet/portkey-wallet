import { useCallback, useEffect, useMemo } from 'react';
import { useAppCASelector } from '../.';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  useCurrentNetworkInfo,
  useIsIMServiceExist,
  useIsMainnet,
  useNetworkList,
} from '@portkey-wallet/hooks/hooks-ca/network';
import {
  getDiscoverGroupAsync,
  getSocialMediaAsync,
  getRememberMeBlackListAsync,
  getTabMenuAsync,
  setEntrance,
  getLoginControlListAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';
import { DEFAULT_LOGIN_MODE_LIST } from '@portkey-wallet/constants/constants-ca/cms';

import { getFaviconUrl, getOrigin } from '@portkey-wallet/utils/dapp/browser';

import { checkSiteIsInBlackList } from '@portkey-wallet/utils/session';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import {
  DEFAULT_ENTRANCE_SHOW,
  filterLoginModeListToOther,
  filterLoginModeListToRecommend,
  generateEntranceShow,
  getEntrance,
  parseLoginModeList,
  sortLoginModeListToAll,
} from './util';
import {
  IEntranceItem,
  IEntranceMatchValueConfig,
  IEntranceMatchValueMap,
  ILoginModeItem,
} from '@portkey-wallet/types/types-ca/cms';
import { NetworkType } from '@portkey-wallet/types';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';

export const useCMS = () => useAppCASelector(state => state.cms);

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

export const useEntrance = (config: IEntranceMatchValueConfig, isInit = false) => {
  const dispatch = useAppCommonDispatch();
  const { entranceNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const entrance = useMemo(
    () => ({
      ...DEFAULT_ENTRANCE_SHOW,
      ...entranceNetMap?.[networkType],
    }),
    [networkType, entranceNetMap],
  );

  const refresh = useCallback(
    async (network?: NetworkType) => {
      const _entranceList = (await getEntrance(network || networkType)) as IEntranceItem[];
      const _entrance = await generateEntranceShow(config, _entranceList || []);
      dispatch(
        setEntrance({
          network: network || networkType,
          value: _entrance,
        }),
      );
      return _entrance;
    },
    [config, dispatch, networkType],
  );

  useEffectOnce(() => {
    if (isInit) {
      networkList.forEach(item => {
        refresh(item.networkType);
      });
    }
  });

  useEffectOnce(() => {
    if (!isInit) {
      refresh();
    }
  });

  return {
    entrance,
    refresh,
  };
};

export const useBuyButtonShow = (config: IEntranceMatchValueConfig) => {
  const { entrance, refresh } = useEntrance(config);
  const isMainnet = useIsMainnet();

  const isBuySectionShow = useMemo(() => isMainnet && entrance.buy, [entrance.buy, isMainnet]);

  const isSellSectionShow = useMemo(() => isMainnet && entrance.sell, [entrance.sell, isMainnet]);

  const isBuyButtonShow = useMemo(
    () => isMainnet && (isBuySectionShow || isSellSectionShow || false),
    [isBuySectionShow, isMainnet, isSellSectionShow],
  );

  const refreshBuyButton = useCallback(async () => {
    let isBuySectionShow = false;
    let isSellSectionShow = false;
    try {
      const result = await refresh();
      isBuySectionShow = result.buy;
      isSellSectionShow = result.sell;
    } catch (error) {
      console.log('refreshBuyButton error');
    }

    return {
      isBuySectionShow: isMainnet && isBuySectionShow,
      isSellSectionShow: isMainnet && isSellSectionShow,
    };
  }, [isMainnet, refresh]);

  return {
    isBuyButtonShow,
    isBuySectionShow,
    isSellSectionShow,
    refreshBuyButton,
  };
};

export const useETransShow = (config: IEntranceMatchValueConfig) => {
  const { entrance, refresh } = useEntrance(config);
  const { eTransferUrl } = useCurrentNetworkInfo();

  const isETransDepositShow = useMemo(
    () => !!(entrance.eTransDeposit && eTransferUrl),
    [eTransferUrl, entrance.eTransDeposit],
  );

  const isETransWithdrawShow = useMemo(
    () => !!(entrance.eTransWithdraw && eTransferUrl),
    [eTransferUrl, entrance.eTransWithdraw],
  );

  const isETransShow = useMemo(
    () => isETransDepositShow || isETransWithdrawShow || false,
    [isETransDepositShow, isETransWithdrawShow],
  );

  const refreshETrans = useCallback(async () => {
    let _isETransDepositShow = false;
    let _isETransWithdrawShow = false;
    try {
      const result = await refresh();
      _isETransDepositShow = result.eTransDeposit;
      _isETransWithdrawShow = result.eTransWithdraw;
    } catch (error) {
      console.log('refreshBuyButton error');
    }

    return {
      isETransDepositShow: _isETransDepositShow,
      isETransWithdrawShow: _isETransWithdrawShow,
    };
  }, [refresh]);

  return {
    isETransShow,
    isETransDepositShow,
    isETransWithdrawShow,
    refreshETrans,
  };
};
export const useBridgeButtonShow = (config: IEntranceMatchValueConfig) => {
  const { entrance } = useEntrance(config);
  const isBridgeShow = useMemo(() => entrance?.bridge, [entrance.bridge]);

  return {
    isBridgeShow,
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
  const { tabMenuListNetMap } = useCMS() || {};
  const { networkType } = useCurrentNetworkInfo();
  const isIMServiceExist = useIsIMServiceExist();

  const IsChatShow = useMemo(() => {
    if (!tabMenuListNetMap) {
      return false;
    }
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
      if (target?.imgUrl?.filename_disk) return `${s3Url}/${target?.imgUrl?.filename_disk}`;

      return getFaviconUrl(domain);
    },
    [cmsWebsiteMap, s3Url],
  );

  const getCmsWebsiteInfoName = useCallback((domain: string) => cmsWebsiteMap?.[domain]?.title || '', [cmsWebsiteMap]);

  return {
    getCmsWebsiteInfoImageUrl,
    getCmsWebsiteInfoName,
  };
};

export const useGetLoginControlListAsync = () => {
  const dispatch = useAppCommonDispatch();
  const networkList = useNetworkList();
  return useCallback(async () => {
    try {
      await dispatch(getLoginControlListAsync(networkList.map(item => item.networkType)));
    } catch (error) {
      console.log(error, '======error');
    }
  }, [dispatch, networkList]);
};

export const useLoginModeControlList = (forceUpdate?: boolean) => {
  const { loginModeListMap } = useCMS() || {};
  const { networkType } = useCurrentNetworkInfo();

  const getLoginControlListAsync = useGetLoginControlListAsync();
  const dispatch = useAppCommonDispatch();

  useEffect(() => {
    if (forceUpdate) {
      getLoginControlListAsync();
    }
  }, [dispatch, getLoginControlListAsync, forceUpdate]);

  return {
    loginModeListMap,
    currentNetworkLoginModeList: loginModeListMap?.[networkType],
  };
};

export const useGetFormattedLoginModeList = (
  matchValueMap: IEntranceMatchValueMap,
  deviceType: VersionDeviceType,
  forceUpdate?: boolean,
): {
  loginModeList: ILoginModeItem[];
  loginModeListToRecommend: ILoginModeItem[];
  loginModeListToOther: ILoginModeItem[];
} => {
  const { currentNetworkLoginModeList } = useLoginModeControlList(forceUpdate);

  return useMemo(() => {
    if (matchValueMap && currentNetworkLoginModeList && currentNetworkLoginModeList?.length > 0) {
      const loginModeList = parseLoginModeList(currentNetworkLoginModeList, matchValueMap, deviceType);

      return {
        loginModeList,
        loginModeListToRecommend: filterLoginModeListToRecommend(loginModeList, deviceType),
        loginModeListToOther: filterLoginModeListToOther(loginModeList, deviceType),
      };
    }

    return {
      loginModeList: sortLoginModeListToAll(DEFAULT_LOGIN_MODE_LIST, deviceType),
      loginModeListToRecommend: filterLoginModeListToRecommend(DEFAULT_LOGIN_MODE_LIST, deviceType),
      loginModeListToOther: filterLoginModeListToOther(DEFAULT_LOGIN_MODE_LIST, deviceType),
    };
  }, [currentNetworkLoginModeList, deviceType, matchValueMap]);
};
