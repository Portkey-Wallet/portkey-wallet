import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
import { lockWallet } from 'utils/lib/serviceWorkerAction';
import { useSetTokenConfig } from './useSetTokenConfig';
import { getPin } from 'utils/getSeed';

export default function useLocking() {
  const { address } = useCurrentWalletInfo();
  const refreshToken = useSetTokenConfig();

  return useCallback(async () => {
    try {
      if (!address) return;
      const pin = await getPin();
      if (!pin) return lockWallet();
      refreshToken(pin);
    } catch (error) {
      console.log(error, '====error');
    }
  }, [address, refreshToken]);
}
