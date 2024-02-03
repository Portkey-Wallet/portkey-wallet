import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback, useEffect } from 'react';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';
import { useStorage } from 'hooks/useStorage';
import { reportUserCurrentNetwork } from 'utils/analysisReport';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useNavigateState } from 'hooks/router';

const Unlock = () => {
  const navigate = useNavigateState();
  const { isPrompt } = useCommonState();
  const { networkType } = useCurrentNetwork();
  const { walletInfo, currentNetwork } = useWalletInfo();
  const locked = useStorage('locked');
  console.log(locked, 'locked==');
  useEffect(() => {
    if (locked === false) {
      return navigate('/');
    }
  }, [locked, navigate]);

  useEffect(() => {
    reportUserCurrentNetwork(networkType);
  }, [networkType]);

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
      <LockPage header={isPrompt && <RegisterHeader />} onUnLockHandler={handleNavigate} />
    </div>
  );
};
export default Unlock;
