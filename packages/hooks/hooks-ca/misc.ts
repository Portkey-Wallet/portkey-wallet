import { useAppCASelector } from '.';
import { getPhoneCountryCode } from '@portkey-wallet/store/store-ca/misc/actions';
import { useEffect, useMemo } from 'react';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { getCountryCodeIndex } from '@portkey-wallet/constants/constants-ca/country';

export const useMisc = () => useAppCASelector(state => state.misc);

export function usePhoneCountryCode(isInit = false) {
  const dispatch = useAppCommonDispatch();

  const { phoneCountryCodeListChainMap } = useMisc();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const phoneCountryCodeList = useMemo(
    () => phoneCountryCodeListChainMap?.[networkType] || [],
    [networkType, phoneCountryCodeListChainMap],
  );

  const phoneCountryCodeIndex = useMemo(() => getCountryCodeIndex(phoneCountryCodeList), [phoneCountryCodeList]);

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        const phoneCountryCodeIndexChainMapItem = phoneCountryCodeListChainMap?.[item.networkType] || [];
        if (phoneCountryCodeIndexChainMapItem.length === 0) {
          dispatch(getPhoneCountryCode(item.networkType));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getPhoneCountryCode(networkType));
    }
  }, [dispatch, isInit, networkType]);

  return { phoneCountryCodeList, phoneCountryCodeIndex };
}
