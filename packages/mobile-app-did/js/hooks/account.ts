import { request } from '@portkey-wallet/api/api-did';
import { useCallback, useState } from 'react';
import useEffectOnce from './useEffectOnce';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useCaAddressInfoList, useChainIdList, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef, useThrottleCallback } from '@portkey-wallet/hooks';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { PAGE_SIZE_IN_ACCOUNT_ASSETS, PAGE_SIZE_IN_ACCOUNT_TOKEN } from '@portkey-wallet/constants/constants-ca/assets';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';

export function useIsShowDeletion() {
  const [showDeletion, setShowDeletion] = useState(false);
  const init = useCallback(async () => {
    try {
      const req = await request.wallet.getShowDeletionEntrance();
      setShowDeletion(!!req?.entranceDisplay);
    } catch (error) {
      console.log(error, '===error');
    }
  }, []);
  useEffectOnce(() => {
    if (isIOS) init();
  });
  return showDeletion;
}

export function useGetAccountTokenList() {
  const { caAddressList } = useCurrentWalletInfo();
  const caAddressInfoList = useCaAddressInfoList();

  const { fetchAccountTokenInfoList } = useAccountTokenInfo();

  const lastCaAddressInfoList = useLatestRef(caAddressInfoList);
  return useThrottleCallback(
    () => {
      if (caAddressList?.length === 0) return;
      return fetchAccountTokenInfoList({
        caAddressInfos: lastCaAddressInfoList.current || [],
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [caAddressList, caAddressInfoList, lastCaAddressInfoList],
    1000,
  );
}

export function useGetAllTokenInfoList() {
  const { fetchTokenInfoList } = useToken();

  const caAddressInfoList = useCaAddressInfoList();
  const chainIdList = useChainIdList();

  return useThrottleCallback(
    () => {
      if (caAddressInfoList?.length === 0) return;
      return fetchTokenInfoList({
        chainIdArray: chainIdList,
        keyword: '',
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    },
    [caAddressInfoList?.length, chainIdList, fetchTokenInfoList],
    1000,
  );
}
