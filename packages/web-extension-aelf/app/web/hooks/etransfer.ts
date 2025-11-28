import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCallback, useEffect } from 'react';
import { eTransferCore } from '@etransfer/core';
import { useCommonState } from 'store/Provider/hooks';
import { useLatestRef } from '@portkey-wallet/hooks';
import { sleep } from '@portkey-wallet/utils';

export const useCheckETransferIsRegistration = (noRegistrationCallback: () => void) => {
  const { isPrompt } = useCommonState();
  const latestIsPrompt = useLatestRef(isPrompt);
  const { eTransferUrl } = useCurrentNetworkInfo();
  const account = useCurrentAccount();
  const checkIsRegistration = useCallback(async () => {
    await sleep(100);
    if (!account?.address || latestIsPrompt.current) return;
    eTransferCore.init({
      etransferUrl: eTransferUrl,
    });
    const isRegistration = await eTransferCore.services.checkEOARegistration({ address: account?.address });
    if (!isRegistration.result) return noRegistrationCallback();
  }, [account?.address, eTransferUrl, latestIsPrompt, noRegistrationCallback]);

  useEffect(() => {
    checkIsRegistration();
  }, [checkIsRegistration]);
};
