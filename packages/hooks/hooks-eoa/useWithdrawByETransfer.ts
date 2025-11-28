import { useCurrentNetworkInfo } from './network';
import { useEffect, useMemo } from 'react';
import { useCurrentAccount } from './wallet';
import { useCurrentChainList } from './chainList';
import CrossTransfer from '@portkey-wallet/utils/withdrawEOA';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';

const crossChainTransfer = new CrossTransfer();

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];

export const useCrossTransferByEtransfer = (pin?: string) => {
  const { eTransferUrl, eTransferCA } = useCurrentNetworkInfo();
  const currentChainList = useCurrentChainList();
  const account = useCurrentAccount();

  useEffect(() => {
    if (!eTransferUrl || !pin || !currentChainList || !eTransferCA || !account) return;
    crossChainTransfer.init({
      eTransferUrl: eTransferUrl,
      account,
      pin,
      chainList: currentChainList,
      eTransferCA,
      storage: AsyncStorage,
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
