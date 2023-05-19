import { useAppCASelector } from '.';
import { getPhoneCountryCode, setLocalPhoneCountryCodeAction } from '@portkey-wallet/store/store-ca/misc/actions';
import { useEffect, useMemo, useCallback } from 'react';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { DefaultCountry, getCountryCodeIndex } from '@portkey-wallet/constants/constants-ca/country';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';

export const useMisc = () => useAppCASelector(state => state.misc);

export function useSetLocalPhoneCountryCode() {
  const dispatch = useAppCommonDispatch();

  const setLocalPhoneCountryCode = useCallback(
    (countryItem: CountryItem) => {
      dispatch(setLocalPhoneCountryCodeAction(countryItem));
    },
    [dispatch],
  );

  return setLocalPhoneCountryCode;
}

export function usePhoneCountryCode(isInit = false) {
  const dispatch = useAppCommonDispatch();

  const {
    phoneCountryCodeListChainMap,
    defaultPhoneCountryCode,
    localPhoneCountryCode: storeLocalPhoneCountryCode,
  } = useMisc();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const phoneCountryCodeList = useMemo(
    () => phoneCountryCodeListChainMap?.[networkType] || [],
    [networkType, phoneCountryCodeListChainMap],
  );

  const phoneCountryCodeIndex = useMemo(() => getCountryCodeIndex(phoneCountryCodeList), [phoneCountryCodeList]);

  const localPhoneCountryCode = useMemo(
    () => storeLocalPhoneCountryCode || defaultPhoneCountryCode || DefaultCountry,
    [defaultPhoneCountryCode, storeLocalPhoneCountryCode],
  );

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

  const setLocalPhoneCountryCode = useSetLocalPhoneCountryCode();

  return { phoneCountryCodeList, phoneCountryCodeIndex, localPhoneCountryCode, setLocalPhoneCountryCode };
}
