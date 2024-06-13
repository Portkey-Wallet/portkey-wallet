import { useGetFormattedLoginModeList, useGetLoginControlListAsync } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useEntranceConfig } from './cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { useCallback, useMemo } from 'react';
import { sleep } from '@portkey-wallet/utils';

export function useLoginModeList() {
  const config = useEntranceConfig();
  const { loginModeList } = useGetFormattedLoginModeList(config, VersionDeviceType.Extension);
  return useMemo(() => loginModeList, [loginModeList]);
}

export function useInitLoginModeList() {
  const getLoginControlListAsync = useGetLoginControlListAsync();

  return useCallback(async () => {
    try {
      await Promise.race([getLoginControlListAsync(), sleep(3000)]);
    } catch (error) {
      console.log(error, '=====error-getLoginControlListAsync');
    }
  }, [getLoginControlListAsync]);
}
