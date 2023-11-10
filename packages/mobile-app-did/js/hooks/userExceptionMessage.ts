import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { Severity } from '@portkey-wallet/utils/ExceptionManager';
import { useCallback } from 'react';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import * as Application from 'expo-application';
export default function useExceptionMessage() {
  const { caHash } = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetwork();
  return useCallback(
    (message: string) => {
      const version = Application.nativeApplicationVersion;
      exceptionManager.reportErrorMessage(`${caHash}-${currentNetwork}-${version}-${message}`, Severity.Info);
      exceptionManager.reportAnalyticsEvent({
        eventName: 'ExceptionMessage',
        params: {
          caHash,
          currentNetwork,
          message,
          version,
        },
      });
    },
    [caHash, currentNetwork],
  );
}
