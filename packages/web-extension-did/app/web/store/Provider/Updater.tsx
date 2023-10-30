import useVerifierList from 'hooks/useVerifierList';
import { useEffect, useMemo } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
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
import { useRememberMeBlackList, useSocialMediaList, useTabMenuList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import usePortkeyUIConfig from 'hooks/usePortkeyUIConfig';
import im from '@portkey-wallet/im';
import s3Instance from '@portkey-wallet/utils/s3';
import initIm from 'hooks/im';
import { useCheckContactMap } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useExtensionEntrance } from 'hooks/cms';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { initConfig } from './initConfig';

keepAliveOnPages({});
request.setExceptionManager(exceptionManager);

export default function Updater() {
  const onLocking = useLocking();
  const { pathname } = useLocation();
  const { passwordSeed } = useUserInfo();
  const checkManagerOnLogout = useCheckManagerOnLogout();

  const { apiUrl, imApiUrl, imWsUrl, imS3Bucket } = useCurrentNetworkInfo();
  useMemo(() => {
    request.set('baseURL', apiUrl);
    if (request.defaultConfig.baseURL !== apiUrl) {
      request.defaultConfig.baseURL = apiUrl;
    }
  }, [apiUrl]);
  useMemo(() => {
    im.setUrl({
      apiUrl: imApiUrl || '',
      wsUrl: imWsUrl || '',
    });
  }, [imApiUrl, imWsUrl]);
  useMemo(() => {
    s3Instance.setConfig({
      bucket: imS3Bucket || '',
      key: process.env.IM_S3_KEY || '',
    });
  }, [imS3Bucket]);
  initIm();
  useVerifierList();
  useUpdateRedux();
  useLocationChange();
  useChainListFetch();
  useRefreshTokenConfig(passwordSeed);
  const checkUpdate = useCheckUpdate();

  useCheckManager(checkManagerOnLogout);
  useFetchTxFee();
  useEffect(() => {
    checkUpdate();
  }, [checkUpdate]);

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
  useExtensionEntrance(true);
  useRememberMeBlackList(true);
  useTabMenuList(true);
  useCheckContactMap();

  useEffectOnce(() => {
    initConfig();
  });
  return null;
}
