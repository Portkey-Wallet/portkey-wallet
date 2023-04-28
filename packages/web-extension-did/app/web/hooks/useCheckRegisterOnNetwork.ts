import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { RegisterStatus } from 'types';
import { useStorage } from './useStorage';

export default function useCheckRegisterOnNetwork() {
  const navigate = useNavigate();
  const registerStatus = useStorage<RegisterStatus>('registerStatus');
  const location = useLocation();
  const wallet = useStorage<any>('reduxStorageWallet');
  const { currentNetwork, walletInfo } = useMemo(() => {
    const _wallet = JSON.parse(wallet || null);
    return {
      currentNetwork: _wallet?.currentNetwork ? JSON.parse(_wallet?.currentNetwork) : undefined,
      walletInfo: _wallet?.walletInfo ? JSON.parse(_wallet?.walletInfo || {}) : undefined,
    };
  }, [wallet]);

  useEffect(() => {
    const isRegisterSuccessBeforePage =
      location.pathname.startsWith('/register') || location.pathname.startsWith('/login');

    if (registerStatus === 'Registered' && isRegisterSuccessBeforePage && walletInfo?.caInfo?.[currentNetwork]) {
      navigate('/');
    }
  }, [currentNetwork, location.pathname, navigate, registerStatus, walletInfo?.caInfo]);
}
