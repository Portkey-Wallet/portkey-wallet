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
      exceptionManager.reportErrorMessage(
        `${caHash}-${currentNetwork}-${Application.nativeApplicationVersion}-${message}`,
        Severity.Info,
      );
    },
    [caHash, currentNetwork],
  );
}
