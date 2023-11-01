import { useCallback, useMemo } from 'react';
import { useAppCASelector, useAppCommonDispatch } from '../../index';
import ramp from '@portkey-wallet/ramp';
import { sleep } from '@portkey-wallet/utils';
import { setRampEntry, setRampInfo } from '@portkey-wallet/store/store-ca/ramp/actions';
import { useUpdateBuyCrypto, useUpdateBuyFiat } from './buy';
import { useUpdateSellCrypto, useUpdateSellFiat } from './sell';
import { useIsMainnet } from '../network';

export const useRamp = () => useAppCASelector(state => state.ramp);

export const useInitRamp = () => {
  const isMainnet = useIsMainnet();
  const { refreshRampShow } = useRampShow();
  const { refreshBuyCrypto } = useUpdateBuyCrypto();
  const { refreshBuyFiat } = useUpdateBuyFiat();
  const { refreshSellCrypto } = useUpdateSellCrypto();
  const { refreshSellFiat } = useUpdateSellFiat();

  return useCallback(async () => {
    if (!isMainnet) return;

    const { isBuySectionShow, isSellSectionShow } = await refreshRampShow();

    await sleep(1000);

    if (isBuySectionShow) {
      // fetch fiatList and defaultFiat
      const { buyDefaultFiat } = await refreshBuyFiat();
      // fetch defaultCrypto
      refreshBuyCrypto(buyDefaultFiat.symbol);
    }

    if (isSellSectionShow) {
      // fetch cryptoList and defaultCrypto
      const { sellDefaultCrypto } = await refreshSellCrypto();
      // fetch defaultFiat
      refreshSellFiat(sellDefaultCrypto.symbol);
    }
  }, [isMainnet, refreshRampShow, refreshBuyFiat, refreshBuyCrypto, refreshSellCrypto, refreshSellFiat]);
};

export const useRefreshRampInfo = () => {
  const dispatch = useAppCommonDispatch();
  const { rampInfo } = useRamp();

  const refreshRampInfo = useCallback(async () => {
    const {
      data: { thirdPart: rampProviders },
    } = await ramp.service.getRampInfo();

    dispatch(setRampInfo({ info: rampProviders }));

    return rampProviders;
  }, [dispatch]);

  return { rampInfo, refreshRampInfo };
};

export const useRampShow = () => {
  const dispatch = useAppCommonDispatch();
  const isMainnet = useIsMainnet();
  const { rampEntry } = useRamp();
  const { refreshRampInfo } = useRefreshRampInfo();

  const isBuySectionShow = useMemo(
    () => isMainnet && rampEntry.isBuySectionShow,
    [isMainnet, rampEntry.isBuySectionShow],
  );

  const isSellSectionShow = useMemo(
    () => isMainnet && rampEntry.isSellSectionShow,
    [isMainnet, rampEntry.isSellSectionShow],
  );

  const isRampShow = useMemo(() => isMainnet && rampEntry.isRampShow, [isMainnet, rampEntry.isRampShow]);

  const refreshRampShow = useCallback(async () => {
    const rampProviders = await refreshRampInfo();

    const isBuySectionShowNew = Object.keys(rampProviders).some(key => {
      return rampProviders[key].coverage.buy === true;
    });
    const isSellSectionShowNew = Object.keys(rampProviders).some(key => {
      return rampProviders[key].coverage.sell === true;
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
  }, [dispatch, isMainnet, refreshRampInfo]);

  return {
    isRampShow,
    isBuySectionShow,
    isSellSectionShow,
    refreshRampShow,
  };
};

export * from './buy';
export * from './sell';
