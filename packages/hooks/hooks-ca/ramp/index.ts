import { message } from 'antd';
import { useCallback } from 'react';
import { useAppCommonDispatch } from '../../index';
import ramp from '@portkey-wallet/ramp';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { setRampEntry, setRampInfo } from '@portkey-wallet/store/store-ca/ramp/actions';
import { useUpdateBuyDefault, useUpdateBuyCryptoList, useUpdateBuyFiatList } from './buy';
import { useUpdateSellDefault, useUpdateSellCryptoList, useUpdateSellFiatList } from './sell';

export const useInitRamp = () => {
  const dispatch = useAppCommonDispatch();
  const updateBuyDefault = useUpdateBuyDefault();
  const updateBuyCryptoList = useUpdateBuyCryptoList();
  const updateBuyFiatList = useUpdateBuyFiatList();
  const updateSellDefault = useUpdateSellDefault();
  const updateSellCryptoList = useUpdateSellCryptoList();
  const updateSellFiatList = useUpdateSellFiatList();

  return useCallback(async () => {
    try {
      const {
        data: { thirdPart: rampProviders },
      } = await ramp.service.getRampInfo();

      const isBuySectionShow = Object.keys(rampProviders).some(key => {
        return rampProviders[key].coverage.buy === true;
      });
      const isSellSectionShow = Object.keys(rampProviders).some(key => {
        return rampProviders[key].coverage.sell === true;
      });
      const isRampShow = isBuySectionShow || isSellSectionShow;

      dispatch(setRampInfo({ info: rampProviders }));
      dispatch(setRampEntry({ isRampShow, isBuySectionShow, isSellSectionShow }));

      await sleep(1000);

      if (isBuySectionShow) {
        const { buyDefaultCrypto, buyDefaultFiat } = await updateBuyDefault();
        // No need to request crypto List asynchronously
        updateBuyCryptoList(buyDefaultFiat.symbol);
        updateBuyFiatList(buyDefaultCrypto.symbol);
      }

      if (isSellSectionShow) {
        const { sellDefaultCrypto, sellDefaultFiat } = await updateSellDefault();
        // No need to request crypto List asynchronously
        updateSellCryptoList(sellDefaultFiat.symbol);
        updateSellFiatList(sellDefaultCrypto.symbol);
      }
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, [
    dispatch,
    updateBuyCryptoList,
    updateBuyDefault,
    updateBuyFiatList,
    updateSellCryptoList,
    updateSellDefault,
    updateSellFiatList,
  ]);
};

export * from './buy';
export * from './sell';
