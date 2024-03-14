import { request } from '@portkey-wallet/api/api-did';
import { useCallback, useState } from 'react';
import useEffectOnce from './useEffectOnce';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useCaAddressInfoList, useChainIdList, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAppDispatch } from 'store/hooks';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useLatestRef, useThrottleCallback } from '@portkey-wallet/hooks';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';

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
  const dispatch = useAppDispatch();
  const caAddressInfoList = useCaAddressInfoList();
  const lastCaAddressInfoList = useLatestRef(caAddressInfoList);
  return useThrottleCallback(
    () => {
      if (caAddressList?.length === 0) return;
      return dispatch(fetchTokenListAsync({ caAddressInfos: lastCaAddressInfoList.current || [] }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [caAddressList, caAddressInfoList, dispatch, lastCaAddressInfoList],
    1000,
  );
}

export function useGetAllTokenInfoList() {
  const dispatch = useAppDispatch();
  const caAddressInfoList = useCaAddressInfoList();
  const chainIdList = useChainIdList();

  return useThrottleCallback(
    () => {
      if (caAddressInfoList?.length === 0) return;
      return dispatch(fetchAllTokenListAsync({ chainIdArray: chainIdList }));
    },
    [caAddressInfoList?.length, chainIdList, dispatch],
    1000,
  );
}
