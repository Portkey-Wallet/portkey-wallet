import { request } from '@portkey-wallet/api/api-eoa';
// import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useInitChainList } from '@portkey-wallet/hooks/hooks-eoa/network/chain';

import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { useEffect, useMemo } from 'react';
import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import useLocking from 'hooks/useLocking';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useFetchSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { useCheckManager } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { useCheckManagerOnLogout } from 'hooks/useLogOut';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import {
  useDiscoverGroupList,
  useSocialMediaList,
  useRememberMeBlackList,
  useTabMenuList,
} from '@portkey-wallet/hooks/hooks-ca/cms';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import { service } from 'api/utils';

request.setExceptionManager(exceptionManager);

export default function Updater() {
  // const isMainnet = useIsMainnet();

  // FIXME: delete language
  const { changeLanguage } = useLanguage();
  useEffectOnce(() => {
    changeLanguage('en');
  });

  // const { apiUrl } = useCurrentNetworkInfo();
  // useMemo(() => {
  //   request.set('baseURL', apiUrl);
  //   if (service.defaults.baseURL !== apiUrl) {
  //     service.defaults.baseURL = apiUrl;
  //   }
  // }, [apiUrl]);

  useInitChainList();
  // useChainListFetch();
  const { apiUrl, imApiUrl, imWsUrl, imS3Bucket, eoaApiUrl } = useCurrentNetworkInfo();
  // const pin = usePin();
  // const onLocking = useLocking();
  // const checkManagerOnLogout = useCheckManagerOnLogout();
  const refreshTokenConfig = useRefreshTokenConfig();
  // const checkCodePushUpdate = useCheckCodePushUpdate();

  // const latestCheckCodePushUpdate = useLatestRef(checkCodePushUpdate);
  // useMemo(async () => {
  //   console.log('pin=====', pin);
  //   await refreshTokenConfig(pin);
  // }, [pin, refreshTokenConfig]);

  // useCaInfoOnChain();
  // useCheckManager(checkManagerOnLogout);

  // useCheckAndInitNetworkDiscoverMap();
  // useFetchSymbolImages();
  // useFetchTxFee();
  useMemo(() => {
    console.log('eoaApiUrl===', eoaApiUrl);
    request.set('baseURL', eoaApiUrl);
    if (service.defaults.baseURL !== eoaApiUrl) {
      service.defaults.baseURL = eoaApiUrl;
    }
  }, [eoaApiUrl]);
  // useMemo(() => {
  //   im.setUrl({
  //     apiUrl: imApiUrl || '',
  //     wsUrl: imWsUrl || '',
  //   });
  // }, [imApiUrl, imWsUrl]);
  // useMemo(() => {
  //   s3Instance.setConfig({
  //     bucket: imS3Bucket || '',
  //     key: (isMainnet ? Config.IM_S3_KEY : Config.IM_S3_TESTNET_KEY) || '',
  //   });
  // }, [imS3Bucket, isMainnet]);

  // useMemo(() => {
  //   request.setLockCallBack(onLocking);
  // }, [onLocking]);

  // useEffectOnce(() => {
  //   // init entryScriptWeb3
  //   EntryScriptWeb3.init();
  //   // init MatchValueMap
  //   MatchValueMap.init();

  //   // socket.onScanLoginSuccess(data => {
  //   //   CommonToast.success(data.body);
  //   // });
  // });
  // useInterval(
  //   () => {
  //     latestCheckCodePushUpdate.current();
  //   },
  //   [latestCheckCodePushUpdate],
  //   CHECK_CODE_PUSH_TIME,
  // );

  // useEffect(() => {
  //   if (!pin) return;
  //   const timer = setTimeout(() => {
  //     codePushOperator.showUpdatedAlert();
  //   }, 3000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [pin]);
  // usePhoneCountryCode(true);
  // useSocialMediaList(true);
  // useTabMenuList(true);
  // useDiscoverGroupList(true);
  // useInitCmsBanner();
  // useInitCMSDiscoverNewData();
  // useAppEntrance(true);
  // useRememberMeBlackList(true);
  // useCheckContactMap();
  // useInitDappWhiteListData();
  // useInitAwaken();
  return null;
}
