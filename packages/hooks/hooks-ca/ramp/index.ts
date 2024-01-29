import { useCallback, useMemo } from 'react';
import { useAppCASelector, useAppCommonDispatch } from '../../index';
import ramp, { IClientType, IRampProviderType } from '@portkey-wallet/ramp';
import { sleep } from '@portkey-wallet/utils';
import { setRampEntry } from '@portkey-wallet/store/store-ca/ramp/actions';
import { useBuyFiat } from './buy';
import { useSellCrypto } from './sell';
import { useCurrentNetworkInfo, useIsMainnet } from '../network';
import { IEntranceMatchValueConfig } from '@portkey-wallet/types/types-ca/cms';
import { useBuyButtonShow } from '../cms/index';

export const useRampState = () => useAppCASelector(state => state.ramp);

export const useBuyFiatListState = () => useAppCASelector(state => state.ramp.buyFiatList);
export const useBuyDefaultFiatState = () => useAppCASelector(state => state.ramp.buyDefaultFiat);
export const useBuyDefaultCryptoListState = () => useAppCASelector(state => state.ramp.buyDefaultCryptoList);
export const useBuyDefaultCryptoState = () => useAppCASelector(state => state.ramp.buyDefaultCrypto);

export const useSellCryptoListState = () => useAppCASelector(state => state.ramp.sellCryptoList);
export const useSellDefaultCryptoState = () => useAppCASelector(state => state.ramp.sellDefaultCrypto);
export const useSellDefaultFiatListState = () => useAppCASelector(state => state.ramp.sellDefaultFiatList);
export const useSellDefaultFiatState = () => useAppCASelector(state => state.ramp.sellDefaultFiat);

export const useInitRamp = ({ clientType }: { clientType: IClientType }) => {
  const { refreshRampShow } = useRampEntryShow();
  const { refreshBuyFiat } = useBuyFiat();
  const { refreshSellCrypto } = useSellCrypto();
  const { apiUrl } = useCurrentNetworkInfo();

  return useCallback(async () => {
    await ramp.init({ baseUrl: apiUrl, clientType });

    const { isBuySectionShow, isSellSectionShow } = await refreshRampShow(false);

    await sleep(1000);

    if (isBuySectionShow) {
      // fetch fiatList and defaultFiat
      await refreshBuyFiat();
    }

    if (isSellSectionShow) {
      // fetch cryptoList and defaultCrypto
      await refreshSellCrypto();
    }
  }, [apiUrl, clientType, refreshRampShow, refreshBuyFiat, refreshSellCrypto]);
};

export const useRampEntryShow = () => {
  const dispatch = useAppCommonDispatch();
  const isMainnet = useIsMainnet();
  const { rampEntry } = useRampState();

  const isBuySectionShow = useMemo(
    () => isMainnet && rampEntry.isBuySectionShow,
    [isMainnet, rampEntry.isBuySectionShow],
  );

  const isSellSectionShow = useMemo(
    () => isMainnet && rampEntry.isSellSectionShow,
    [isMainnet, rampEntry.isSellSectionShow],
  );

  const isRampShow = useMemo(() => isMainnet && rampEntry.isRampShow, [isMainnet, rampEntry.isRampShow]);

  const refreshRampShow = useCallback(
    async (isFetch = true) => {
      if (isFetch) {
        await ramp.refreshRampProvider();
      }

      const rampProviders = ramp.providerMap;

      const isBuySectionShowNew = Object.keys(rampProviders).some(key => {
        return rampProviders[key as IRampProviderType]?.providerInfo.coverage.buy === true;
      });
      const isSellSectionShowNew = Object.keys(rampProviders).some(key => {
        return rampProviders[key as IRampProviderType]?.providerInfo.coverage.sell === true;
      });
      const isRampShowNew = isBuySectionShowNew || isSellSectionShowNew;

      dispatch(
        setRampEntry({
          isRampShow: isRampShowNew,
          isBuySectionShow: isBuySectionShowNew,
          isSellSectionShow: isSellSectionShowNew,
        }),
      );

      return {
        isRampShow: isMainnet && isRampShowNew,
        isBuySectionShow: isMainnet && isBuySectionShowNew,
        isSellSectionShow: isMainnet && isSellSectionShowNew,
      };
    },
    [dispatch, isMainnet],
  );

  return {
    isRampShow,
    isBuySectionShow,
    isSellSectionShow,
    refreshRampShow,
  };
};

export const useMixRampEntryShow = (config: IEntranceMatchValueConfig) => {
  const {
    isBuyButtonShow: isCMSRampShow,
    isBuySectionShow: isCMSBuySectionShow,
    isSellSectionShow: isCMSSellSectionShow,
    refreshBuyButton: refreshCMSRampShow,
  } = useBuyButtonShow(config);

  const {
    isRampShow: isSDKRampShow,
    isBuySectionShow: isSDKBuySectionShow,
    isSellSectionShow: isSDKSellSectionShow,
    refreshRampShow: refreshSDKRampShow,
  } = useRampEntryShow();

  const isRampShow = useMemo(() => isCMSRampShow && isSDKRampShow, [isCMSRampShow, isSDKRampShow]);

  const isBuySectionShow = useMemo(
    () => isCMSBuySectionShow && isSDKBuySectionShow,
    [isCMSBuySectionShow, isSDKBuySectionShow],
  );

  const isSellSectionShow = useMemo(
    () => isCMSSellSectionShow && isSDKSellSectionShow,
    [isCMSSellSectionShow, isSDKSellSectionShow],
  );

  const refreshRampShow = useCallback(
    async (isFetch = true) => {
      const { isBuySectionShow: isCMSBuySectionShow, isSellSectionShow: isCMSSellSectionShow } =
        await refreshCMSRampShow();

      const isCMSRampShow = isCMSBuySectionShow || isCMSSellSectionShow;

      const { isBuySectionShow: isSDKBuySectionShow, isSellSectionShow: isSDKSellSectionShow } =
        await refreshSDKRampShow(isFetch);

      return {
        isRampShow: isCMSRampShow && isSDKRampShow,
        isBuySectionShow: isCMSBuySectionShow && isSDKBuySectionShow,
        isSellSectionShow: isCMSSellSectionShow && isSDKSellSectionShow,
      };
    },
    [isSDKRampShow, refreshCMSRampShow, refreshSDKRampShow],
  );

  return {
    isRampShow,
    isBuySectionShow,
    isSellSectionShow,
    refreshRampShow,
  };
};

export * from './buy';
export * from './sell';
