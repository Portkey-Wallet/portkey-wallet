import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { fetchIsShowBuyFeatureAsync } from '@portkey-wallet/store/store-ca/switch/slice';
import { useEffect } from 'react';
import { isIOS } from '@rneui/base';

export const useIsShowBuy = (): boolean => {
  const { isShowBuyFeature } = useAppCASelector(state => state.switch);
  return true;
  return isIOS ? isShowBuyFeature : true;
};

export const useFetchIsShowBuyButton = () => {
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    if (isIOS) dispatch(fetchIsShowBuyFeatureAsync());
  }, [dispatch]);
};
