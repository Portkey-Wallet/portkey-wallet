import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
// import { useNavigate } from 'react-router';
import { lockWallet } from 'utils/lib/serviceWorkerAction';

export default function useLocking() {
  const { address } = useCurrentWalletInfo();
  // const navigate = useNavigate();
  return useCallback(() => {
    try {
      if (!address) return;
      lockWallet();
      // navigate('/unlock');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [address]);
}
