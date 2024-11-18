import { useCurrentNetworkInfo } from './network';
import { useEffect, useMemo } from 'react';
import { useCurrentWallet } from './wallet';

import { useCurrentChainList } from './chainList';
import CrossTransfer from '@portkey-wallet/utils/withdraw';
import AsyncStorage from '@react-native-async-storage/async-storage';

const crossChainTransfer = new CrossTransfer();

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];

export const useCrossTransferByEtransfer = (pin?: string) => {
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
      storage: AsyncStorage,
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
