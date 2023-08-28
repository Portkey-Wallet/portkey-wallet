import RegisterHeader from 'pages/components/RegisterHeader';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';
import { useStorage } from 'hooks/useStorage';
import { reportUserCurrentNetwork } from 'utils/analysisReport';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';

const Unlock = () => {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const { netWorkType } = useCurrentNetwork();
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

  return (
    <div>
      <LockPage header={isPrompt && <RegisterHeader />} onUnLockHandler={() => navigate('/')} />
    </div>
  );
};
export default Unlock;
