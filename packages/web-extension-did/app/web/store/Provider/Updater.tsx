import useVerifierList from 'hooks/useVerifierList';
import { useEffect, useMemo } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentApiUrl } from '@portkey-wallet/hooks/hooks-ca/network';
import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { useUserInfo } from './hooks';
import { request } from '@portkey-wallet/api/api-did';
import useLocking from 'hooks/useLocking';
import { useActiveLockStatus } from 'hooks/useActiveLockStatus';
import useLocationChange from 'hooks/useLocationChange';
import useLocalInfo from 'hooks/useLocalInfo';
import { useCheckManagerOnLogout } from 'hooks/useLogout';
import { useCheckManager } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { useCheckUpdate, useCheckUpdateModal } from 'hooks/useCheckUpdate';
import usePortkeyUIConfig from 'hooks/usePortkeyUIConfig';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import { useLocation } from 'react-router';

keepAliveOnPages({});

export default function Updater() {
  const onLocking = useLocking();
  const { pathname } = useLocation();
  const { passwordSeed } = useUserInfo();
  const checkManagerOnLogout = useCheckManagerOnLogout();

  useVerifierList();
  useUpdateRedux();
  useLocationChange();
  useChainListFetch();
  useRefreshTokenConfig(passwordSeed);
  useLocalInfo();
  const checkUpdate = useCheckUpdate();
  useCheckUpdateModal();
  const apiUrl = useCurrentApiUrl();

  useCheckManager(checkManagerOnLogout);

  useEffect(() => {
    checkUpdate();
  }, [checkUpdate]);

  useMemo(() => {
    request.set('baseURL', apiUrl);
  }, [apiUrl]);

  usePortkeyUIConfig();

  useCaInfoOnChain();
  useActiveLockStatus();
  useEffect(() => {
    const app = document.getElementById('root');
    if (!app) return;
    app.scrollTop = 0;
  }, [pathname]);
  useMemo(() => {
    request.setLockCallBack(onLocking);
  }, [onLocking]);
  usePhoneCountryCode(true);
  return null;
}
