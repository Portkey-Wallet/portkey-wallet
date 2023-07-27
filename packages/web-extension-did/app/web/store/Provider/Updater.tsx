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
import { useCheckManagerOnLogout } from 'hooks/useLogout';
import { useCheckManager } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { useCheckUpdate } from 'hooks/useCheckUpdate';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useLocation } from 'react-router';
import { useBuyButton, useRememberMeBlackList, useSocialMediaList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import usePortkeyUIConfig from 'hooks/usePortkeyUIConfig';

keepAliveOnPages({});
request.setExceptionManager(exceptionManager);

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
  const checkUpdate = useCheckUpdate();

  const apiUrl = useCurrentApiUrl();

  useCheckManager(checkManagerOnLogout);
  useFetchTxFee();
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
  useSocialMediaList(true);
  useBuyButton(true);
  useRememberMeBlackList(true);
  return null;
}
