import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';

import CrossTransfer from '@portkey-wallet/utils/withdrawEOA';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { useEffect, useMemo } from 'react';

const crossChainTransfer = new CrossTransfer();

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];

export const useCrossTransferByEtransfer = (pin?: string) => {
  const { eTransferUrl, eTransferCA } = useCurrentNetworkInfo();
  const currentChainList = useCurrentChainList();
  const account = useCurrentAccount();

  useEffect(() => {
    if (!eTransferUrl || !pin || !currentChainList || !eTransferCA || !account) {
      return;
    }
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
