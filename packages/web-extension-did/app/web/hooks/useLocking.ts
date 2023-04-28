import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
// import { useNavigate } from 'react-router';
import { useLockWallet } from 'utils/lib/serviceWorkerAction';

export default function useLocking() {
  const { address } = useCurrentWalletInfo();
  const lockWallet = useLockWallet();
  // const navigate = useNavigate();
  return useCallback(() => {
    try {
      if (!address) return;
      lockWallet();
      // navigate('/unlock');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [address, lockWallet]);
}
