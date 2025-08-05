import { useEffect, useMemo } from 'react';
import { CrossTransferExtension } from 'utils/sandboxUtil/extension-cross-chain';
import { usePin } from './usePin';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { localStorage } from 'redux-persist-webextension-storage';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { reCAPTCHAActionETransfer } from 'utils/lib/serviceWorkerAction';

const crossChainTransfer = new CrossTransferExtension();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verifyHumanMachine = async (_language: any, _isEtransfer = false, isMainnet?: boolean) => {
  const req = await reCAPTCHAActionETransfer(isMainnet);
  return req.response;
};

export const useCrossTransferByEtransfer = () => {
  const pin = usePin();
  const account = useCurrentAccount();
  const { eTransferUrl, eTransferCA } = useCurrentNetworkInfo();
  const currentChainList = useCurrentChainList();

  useEffect(() => {
    if (!eTransferUrl || !pin || !currentChainList || !eTransferCA || !account) return;
    crossChainTransfer.init({
      account,
      eTransferUrl: eTransferUrl,
      pin,
      chainList: currentChainList,
      eTransferCA,
      storage: localStorage,
      verifyHumanMachine: verifyHumanMachine,
    });
  }, [account, currentChainList, eTransferCA, eTransferUrl, pin]);

  return useMemo(
    () => ({
      withdraw: crossChainTransfer.withdraw,
      withdrawPreview: crossChainTransfer.withdrawPreview,
    }),
    [],
  );
};
