import { useCallback, useEffect } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';
import { useStorage } from 'hooks/useStorage';
import { reportUserCurrentNetwork } from 'utils/analysisReport';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useNavigateState } from 'hooks/router';

const Unlock = () => {
  const navigate = useNavigateState();
  const currentNetwork = useCurrentNetwork();
  const { walletInfo } = useWalletInfo();
  const locked = useStorage('locked');
  console.log(locked, 'locked==');
  useEffect(() => {
    if (locked === false) {
      return navigate('/');
    }
  }, [locked, navigate]);

  useEffect(() => {
    reportUserCurrentNetwork(currentNetwork);
  }, [currentNetwork]);

  const handleNavigate = useCallback(() => {
    const caInfo = walletInfo?.caInfo?.[currentNetwork];
    const caHash = caInfo?.[caInfo?.originChainId || 'AELF']?.caHash;
    if (caHash) {
      navigate('/');
    } else {
      navigate('/register/start');
    }
  }, [currentNetwork, navigate, walletInfo?.caInfo]);

  return (
    <div>
      <LockPage onUnLockHandler={handleNavigate} />
    </div>
  );
};
export default Unlock;
