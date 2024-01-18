import clsx from 'clsx';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import MyBalance from './components/MyBalance';
import './index.less';
import qs from 'query-string';
import { useHandleAchSell } from 'pages/Buy/hooks/useHandleAchSell';
import { useStorage } from 'hooks/useStorage';
import walletMessage from 'messages/walletMessage';
import { useEffectOnce } from 'react-use';
import { getStoreState } from 'store/utils/getStore';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import initIm from 'hooks/im';
import { sleep } from '@portkey-wallet/utils';
import { useDiscoverGroupList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { fetchAssetAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useCaAddressInfoList, useCaAddresses } from '@portkey-wallet/hooks/hooks-ca/wallet';

export default function Home() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const isImputation = useIsImputation();
  const store = getStoreState();
  console.log('custom', store);
  const onUserClick = useCallback(() => {
    const url = isNotLessThan768 ? `/setting/wallet` : `/setting`;
    navigate(url);
  }, [isNotLessThan768, navigate]);
  useDiscoverGroupList();
  const appDispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const caAddressInfos = useCaAddressInfoList();

  const { search } = useLocation();
  const isSell = useRef(0); // guaranteed to make only one transfer
  const handleAchSell = useHandleAchSell();
  const locked = useStorage('locked');

  const getAccountAllAssets = useCallback(() => {
    appDispatch(fetchAssetAsync({ caAddresses, keyword: '', caAddressInfos }));
  }, [appDispatch, caAddressInfos, caAddresses]);

  const checkAchSell = useCallback(async () => {
    if (search) {
      const { detail, method } = qs.parse(search);
      if (detail && method === walletMessage.ACH_SELL_REDIRECT && !locked && isSell.current === 0) {
        history.replaceState(null, '', location.pathname);
        isSell.current = 1;

        // wait ramp init
        await sleep(2000);

        await handleAchSell(detail);
      }
    }
  }, [handleAchSell, locked, search]);

  useEffectOnce(() => {
    checkAchSell();
    getAccountAllAssets();
  });
  initIm();

  return (
    <div className={clsx(['portkey-home', isPrompt && 'portkey-prompt'])}>
      <PortKeyHeader unReadShow={isImputation} onUserClick={onUserClick} />
      <div className="portkey-body">
        <MyBalance />
      </div>
    </div>
  );
}
