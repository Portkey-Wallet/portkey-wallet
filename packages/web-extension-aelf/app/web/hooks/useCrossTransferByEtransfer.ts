/**
 * [DEPRECATED-ETRANSFER] - This entire file is deprecated.
 * ETransfer logic has been removed in favor of eBridge for all cross-chain transfers.
 * Keeping this file for reference and potential future restoration.
 */

import { useEffect, useMemo } from 'react';
// import { CrossTransferExtension } from 'utils/sandboxUtil/extension-cross-chain';
import { usePin } from './usePin';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-eoa/chainList';
// import { localStorage } from 'redux-persist-webextension-storage';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { reCAPTCHAActionETransfer } from 'utils/lib/serviceWorkerAction';

// [DEPRECATED-ETRANSFER] CrossTransferExtension instance removed
// const crossChainTransfer = new CrossTransferExtension();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const verifyHumanMachine = async (_language: any, _isEtransfer = false, isMainnet?: boolean) => {
  const req = await reCAPTCHAActionETransfer(isMainnet);
  return req.response;
};

/**
 * @deprecated Use eBridge for cross-chain transfers instead
 */
export const useCrossTransferByEtransfer = () => {
  const pin = usePin();
  const account = useCurrentAccount();
  const { eTransferUrl, eTransferCA } = useCurrentNetworkInfo();
  const currentChainList = useCurrentChainList();

  useEffect(() => {
    // [DEPRECATED-ETRANSFER] ETransfer initialization disabled
    // if (!eTransferUrl || !pin || !currentChainList || !eTransferCA || !account) return;
    // crossChainTransfer.init({
    //   account,
    //   eTransferUrl: eTransferUrl,
    //   pin,
    //   chainList: currentChainList,
    //   eTransferCA,
    //   storage: localStorage,
    //   verifyHumanMachine: verifyHumanMachine,
    // });
    console.warn('[DEPRECATED] useCrossTransferByEtransfer is deprecated. Use eBridge instead.');
  }, [account, currentChainList, eTransferCA, eTransferUrl, pin]);

  return useMemo(
    () => ({
      // [DEPRECATED-ETRANSFER] Return no-op functions
      withdraw: async () => {
        throw new Error('[DEPRECATED] ETransfer withdraw is disabled. Use eBridge instead.');
      },
      withdrawPreview: async () => {
        throw new Error('[DEPRECATED] ETransfer withdrawPreview is disabled. Use eBridge instead.');
      },
    }),
    [],
  );
};
