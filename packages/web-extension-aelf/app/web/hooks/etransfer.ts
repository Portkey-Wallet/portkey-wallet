/**
 * [DEPRECATED-ETRANSFER] - This entire file is deprecated.
 * ETransfer registration check has been removed in favor of eBridge for all cross-chain transfers.
 * Keeping this file for reference and potential future restoration.
 */

// import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
// import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
// import { useCallback, useEffect } from 'react';
// import { eTransferCore } from '@etransfer/core';
// import { useCommonState } from 'store/Provider/hooks';
// import { useLatestRef } from '@portkey-wallet/hooks';
// import { sleep } from '@portkey-wallet/utils';

/**
 * @deprecated ETransfer registration check is no longer needed. Use eBridge instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCheckETransferIsRegistration = (_noRegistrationCallback: () => void) => {
  // [DEPRECATED-ETRANSFER] BEGIN - ETransfer registration check disabled
  // const { isPrompt } = useCommonState();
  // const latestIsPrompt = useLatestRef(isPrompt);
  // const { eTransferUrl } = useCurrentNetworkInfo();
  // const account = useCurrentAccount();
  // const checkIsRegistration = useCallback(async () => {
  //   await sleep(100);
  //   if (!account?.address || latestIsPrompt.current) return;
  //   eTransferCore.init({
  //     etransferUrl: eTransferUrl,
  //   });
  //   const isRegistration = await eTransferCore.services.checkEOARegistration({ address: account?.address });
  //   if (!isRegistration.result) return noRegistrationCallback();
  // }, [account?.address, eTransferUrl, latestIsPrompt, noRegistrationCallback]);
  // useEffect(() => {
  //   checkIsRegistration();
  // }, [checkIsRegistration]);
  // [DEPRECATED-ETRANSFER] END
  // No-op: ETransfer registration check is deprecated
};
