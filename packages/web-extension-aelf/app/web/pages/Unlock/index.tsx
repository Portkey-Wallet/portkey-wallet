import { useCallback, useEffect } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';
import { useStorage } from 'hooks/useStorage';
import { useNavigateState } from 'hooks/router';

const Unlock = () => {
  const navigate = useNavigateState();
  const { walletAddedCount } = useWalletInfo();
  const locked = useStorage('locked');
  console.log(locked, 'locked==');
  useEffect(() => {
    if (locked === false) {
      return navigate('/');
    }
  }, [locked, navigate]);

  const handleNavigate = useCallback(() => {
    if (walletAddedCount > 0) {
      navigate('/');
    } else {
      navigate('/register/start');
    }
  }, [navigate, walletAddedCount]);

  return <LockPage onUnLockHandler={handleNavigate} />;
};
export default Unlock;
