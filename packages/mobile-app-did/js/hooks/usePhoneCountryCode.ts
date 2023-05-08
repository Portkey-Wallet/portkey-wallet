import { getPhoneCountryCode } from '@portkey-wallet/store/store-ca/misc/actions';
import useEffectOnce from './useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import { useMisc } from './store';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useMemo } from 'react';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';

export function usePhoneCountryCode(isInit = false) {
  const dispatch = useAppDispatch();
  const { phoneCountryCodeIndexChainMap } = useMisc();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const phoneCountryCodeIndex = useMemo(
    () => phoneCountryCodeIndexChainMap[networkType] || [],
    [networkType, phoneCountryCodeIndexChainMap],
  );

  useEffectOnce(() => {
    if (isInit) {
      networkList.forEach(item => {
        const phoneCountryCodeIndexChainMapItem = phoneCountryCodeIndexChainMap[item.networkType] || [];
        if (phoneCountryCodeIndexChainMapItem.length === 0) {
          dispatch(getPhoneCountryCode(item.networkType));
        }
      });
    } else {
      dispatch(getPhoneCountryCode(networkType));
    }
  });

  return phoneCountryCodeIndex;
}
