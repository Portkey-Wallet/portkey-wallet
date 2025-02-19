import { useCurrentAddressInfos, useChainIdList } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useLatestRef, useThrottleCallback } from '@portkey-wallet/hooks';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-eoa/assets';
import {
  PAGE_SIZE_IN_ACCOUNT_ASSETS,
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
} from '@portkey-wallet/constants/constants-eoa/assets';
import useToken from '@portkey-wallet/hooks/hooks-eoa/useToken';

export function useGetAccountTokenList() {
  // const addressList = useCurrentAddressInfos();
  const addressInfoList = useCurrentAddressInfos();

  const { fetchAccountTokenInfoList } = useAccountTokenInfo();

  const lastCaAddressInfoList = useLatestRef(addressInfoList);
  lastCaAddressInfoList.current = addressInfoList;
  return useThrottleCallback(
    () => {
      if (addressInfoList?.length === 0) {
        return;
      }
      return fetchAccountTokenInfoList({
        addressInfos: lastCaAddressInfoList.current || [],
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addressInfoList, addressInfoList, lastCaAddressInfoList],
    1000,
  );
}

export function useGetAllTokenInfoList() {
  const { fetchTokenInfoList } = useToken();

  const addressInfoList = useCurrentAddressInfos();
  const chainIdList = useChainIdList();

  return useThrottleCallback(
    () => {
      if (addressInfoList?.length === 0) {
        return;
      }
      return fetchTokenInfoList({
        chainIdArray: chainIdList,
        keyword: '',
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    },
    [addressInfoList?.length, chainIdList, fetchTokenInfoList],
    1000,
  );
}
