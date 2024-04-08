import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
import { lockWallet } from 'utils/lib/serviceWorkerAction';

export default function useLocking() {
  const { address } = useCurrentWalletInfo();
  return useCallback(() => {
    try {
      if (!address) return;
      lockWallet();
    } catch (error) {
      console.log(error, '====error');
    }
  }, [address]);
}
