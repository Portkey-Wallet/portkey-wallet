import { request } from '@portkey-wallet/api/api-did';
import { useChainListFetch } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { service } from 'api/utils';
import { usePin } from 'hooks/store';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { useMemo } from 'react';
import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import useLocking from 'hooks/useLocking';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useFetchSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { useCheckManager } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { useCheckManagerOnLogout } from 'hooks/useLogOut';
import socket from '@portkey-wallet/socket/socket-did';
import CommonToast from 'components/CommonToast';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import {
  useBuyButton,
  useDiscoverGroupList,
  useSocialMediaList,
  useRememberMeBlackList,
} from '@portkey-wallet/hooks/hooks-ca/cms';
import { useTabMenuList } from 'hooks/cms';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import EntryScriptWeb3 from 'utils/EntryScriptWeb3';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCheckAndInitNetworkDiscoverMap } from 'hooks/discover';
import im from '@portkey-wallet/im';
import s3Instance from '@portkey-wallet/utils/s3';
import Config from 'react-native-config';

request.setExceptionManager(exceptionManager);
export default function Updater() {
  // FIXME: delete language
  const { changeLanguage } = useLanguage();
  useEffectOnce(() => {
    changeLanguage('en');
  });
  useChainListFetch();
  const { apiUrl, imApiUrl, imWsUrl, imS3Bucket } = useCurrentNetworkInfo();
  const pin = usePin();
  const onLocking = useLocking();
  const checkManagerOnLogout = useCheckManagerOnLogout();
  useRefreshTokenConfig(pin);

  useCaInfoOnChain();
  useCheckManager(checkManagerOnLogout);

  useCheckAndInitNetworkDiscoverMap();
  useFetchSymbolImages();
  useFetchTxFee();
  useMemo(() => {
    request.set('baseURL', apiUrl);
    if (service.defaults.baseURL !== apiUrl) {
      service.defaults.baseURL = apiUrl;
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
      key: Config.IM_S3_KEY || '',
    });
  }, [imS3Bucket]);

  useMemo(() => {
    request.setLockCallBack(onLocking);
  }, [onLocking]);

  useEffectOnce(() => {
    // init entryScriptWeb3
    EntryScriptWeb3.init();
    socket.onScanLoginSuccess(data => {
      CommonToast.success(data.body);
    });
  });

  usePhoneCountryCode(true);
  useSocialMediaList(true);
  useTabMenuList(true);
  useDiscoverGroupList(true);
  useBuyButton(true);
  useRememberMeBlackList(true);
  return null;
}
