import { useCallback, useEffect } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import LockPage from '../components/LockPage';
import { useStorage } from 'hooks/useStorage';
import { useNavigateState, useLocationState } from 'hooks/router';

type TRouterParams = {
  navigateUrl?: string;
  params?: Record<string, any>;
};

const Unlock = () => {
  const navigate = useNavigateState();
  const { walletAddedCount } = useWalletInfo();
  const { state } = useLocationState<TRouterParams>();
  const { navigateUrl, params } = state || {};
  const locked = useStorage('locked');
  console.log(locked, 'locked==');
  useEffect(() => {
    if (navigateUrl) {
      return;
    }
    if (locked === false) {
      return navigate('/');
    }
  }, [locked, navigate]);

  const handleNavigate = useCallback(
    (pwd: string) => {
      if (navigateUrl) {
        return navigate(navigateUrl, {
          state:
            {
              ...params,
              pin: pwd,
            } || {},
        });
      }
      if (walletAddedCount > 0) {
        navigate('/');
      } else {
        navigate('/register/start');
      }
    },
    [navigate, navigateUrl, params, walletAddedCount],
  );

  return <LockPage onUnLockHandler={handleNavigate} />;
};
export default Unlock;
