import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';
import { useStorage } from 'hooks/useStorage';
import { reportUserCurrentNetwork } from 'utils/analysisReport';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';

const Unlock = () => {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const { netWorkType } = useCurrentNetwork();
  const { walletInfo, currentNetwork } = useWalletInfo();
  const locked = useStorage('locked');
  console.log(locked, 'locked==');
  useEffect(() => {
    if (locked === false) {
      return navigate('/');
    }
  }, [locked, navigate]);

  useEffect(() => {
    reportUserCurrentNetwork(netWorkType);
  }, [netWorkType]);

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
