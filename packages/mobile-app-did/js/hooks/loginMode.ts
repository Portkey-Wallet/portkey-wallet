import { useGetFormattedLoginModeList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useEntranceConfig } from './cms';
import { useMemo } from 'react';

export function useLoginModeList() {
  const config = useEntranceConfig();
  const { loginModeList } = useGetFormattedLoginModeList(
    config,
    isIOS ? VersionDeviceType.iOS : VersionDeviceType.Android,
  );
  return useMemo(() => loginModeList, [loginModeList]);
}
