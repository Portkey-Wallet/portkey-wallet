import { useCallback, useEffect, useMemo, useState } from 'react';
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
  getEntranceListAsync,
} from '@portkey-wallet/store/store-ca/cms/actions';
import { IEntranceItem } from '@portkey-wallet/store/store-ca/cms/types';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { checkSiteIsInBlackList } from '@portkey-wallet/utils/session';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import { DEFAULT_ENTRANCE_SHOW, IEntranceMatchValueConfig, IEntranceShow, generateEntranceShow } from './util';

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
  const { entranceListNetMap } = useCMS();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const entranceList = useMemo(() => entranceListNetMap?.[networkType], [networkType, entranceListNetMap]);
  const [entrance, setEntrance] = useState<IEntranceShow>({
    ...DEFAULT_ENTRANCE_SHOW,
  });

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        if (item.networkType === networkType) return;
        // init other network entrance
        dispatch(getEntranceListAsync(item.networkType));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    const result = await dispatch(getEntranceListAsync(networkType));
    const _entranceList: IEntranceItem[] = result?.payload?.entranceListNetMap?.[networkType];
    const _entrance = await generateEntranceShow(config, _entranceList || []);
    setEntrance(_entrance);
    return _entrance;
  }, [config, dispatch, networkType]);

  useEffectOnce(() => {
    generateEntranceShow(config, entranceList || []).then(_entrance => {
      console.log('init entrance', _entrance, entranceList);
      setEntrance(_entrance);
    });
    refresh();
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
    const result = await refresh();

    return {
      isBuySectionShow: isMainnet && result.buy,
      isSellSectionShow: isMainnet && result.sell,
    };
  }, [isMainnet, refresh]);

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
