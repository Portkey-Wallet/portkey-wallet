import useVerifierList from 'hooks/useVerifierList';
import { useEffect, useMemo } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
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
import { initConfig, initRequest } from './initConfig';
import useFCM from 'hooks/useFCM';
import { useSetTokenConfig } from 'hooks/useSetTokenConfig';
import { useInitLoginModeList } from 'hooks/loginModal';
import { useUserInfo } from './hooks';
import { useInitCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useGetCryptoGiftConfig } from '@portkey-wallet/hooks/hooks-ca/cryptogift';

keepAliveOnPages({});
request.setExceptionManager(exceptionManager);

export default function Updater() {
  const onLocking = useLocking();
  const { pathname } = useLocation();
  const checkManagerOnLogout = useCheckManagerOnLogout();
  const setTokenConfig = useSetTokenConfig();
  const isMainnet = useIsMainnet();
  const initLoginModeList = useInitLoginModeList();
  const { passwordSeed } = useUserInfo();
  const { init: initCryptoGiftConfig } = useGetCryptoGiftConfig();

  const { apiUrl, imApiUrl, imWsUrl, imS3Bucket } = useCurrentNetworkInfo();
  useMemo(async () => {
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
    const s3_key = isMainnet ? process.env.IM_S3_KEY : process.env.IM_S3_TESTNET_KEY;
    s3Instance.setConfig({
      bucket: imS3Bucket || '',
      key: s3_key || '',
    });
  }, [imS3Bucket, isMainnet]);
  useEffect(() => {
    setTokenConfig(passwordSeed);
  }, [passwordSeed, setTokenConfig]);
  initIm();
  useVerifierList();
  useUpdateRedux();
  useLocationChange();
  useChainListFetch();

  const checkUpdate = useCheckUpdate();
  useFCM();

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
  useInitCmsBanner();

  useEffectOnce(() => {
    initConfig();
    initRequest();
    initLoginModeList();
    initCryptoGiftConfig();
  });
  return null;
}
