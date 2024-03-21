import { useCurrentNetwork, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import * as Application from 'expo-application';

export default function useReportAnalyticsEvent() {
  const { caHash } = useCurrentWalletInfo();
  const networkList = useNetworkList();
  const currentNetwork = useCurrentNetwork();
  return useCallback(
    (params: object, eventName = 'ExceptionMessage') => {
      const version = Application.nativeApplicationVersion;
      const networkName = networkList.map(i => i.apiUrl).join('-');
      exceptionManager.reportAnalyticsEvent({
        eventName: eventName,
        params: {
          caHash,
          networkName,
          version,
          currentNetwork,
          ...params,
        },
      });
    },
    [caHash, currentNetwork, networkList],
  );
}
