import { useWithdrawByETransfer } from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import { useEffect } from 'react';
import { eTransferCore } from '@etransfer/core';
import { localStorage } from 'redux-persist-webextension-storage';

export const useWithdrawTransferByExtension = (pin?: string) => {
  useEffect(() => {
    eTransferCore.init({ storage: localStorage });
  }, []);

  return useWithdrawByETransfer(pin);
};
