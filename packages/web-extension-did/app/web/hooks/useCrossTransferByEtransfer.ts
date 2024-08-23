import { useEffect, useMemo } from 'react';
import { CrossTransferExtension } from 'utils/sandboxUtil/extension-cross-chain';
import { usePin } from './usePin';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { localStorage } from 'redux-persist-webextension-storage';

const crossChainTransfer = new CrossTransferExtension();

export const useCrossTransferByEtransfer = () => {
  const pin = usePin();
  const wallet = useCurrentWallet();
  const { eTransferUrl, eTransferCA } = useCurrentNetworkInfo();
  const currentChainList = useCurrentChainList();

  useEffect(() => {
    if (!eTransferUrl || !pin || !currentChainList || !eTransferCA) return;
    crossChainTransfer.init({
      walletInfo: wallet.walletInfo,
      eTransferUrl: eTransferUrl,
      pin,
      chainList: currentChainList,
      eTransferCA,
      storage: localStorage,
    });
  }, [currentChainList, eTransferCA, eTransferUrl, pin, wallet.walletInfo]);

  return useMemo(
    () => ({
      withdraw: crossChainTransfer.withdraw,
      withdrawPreview: crossChainTransfer.withdrawPreview,
    }),
    [],
  );
};
