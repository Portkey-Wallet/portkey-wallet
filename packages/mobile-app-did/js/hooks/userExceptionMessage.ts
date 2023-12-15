import { useCurrentNetwork, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import * as Application from 'expo-application';
export default function useExceptionMessage() {
  const { caHash } = useCurrentWalletInfo();
  const networkList = useNetworkList();
  const currentNetwork = useCurrentNetwork();
  return useCallback(
    (message: string) => {
      const version = Application.nativeApplicationVersion;
      const networkName = networkList.map(i => i.apiUrl).join('-');
      exceptionManager.reportAnalyticsEvent({
        eventName: 'ExceptionMessage',
        params: {
          caHash,
          networkName,
          message,
          version,
          currentNetwork,
        },
      });
    },
    [caHash, currentNetwork, networkList],
  );
}
