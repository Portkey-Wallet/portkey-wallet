import clsx from 'clsx';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import MyBalance from './components/MyBalance';
import './index.less';
import qs from 'query-string';
import { useHandleAchSell } from 'pages/Buy/hooks/useHandleAchSell';
import { useStorage } from 'hooks/useStorage';
import walletMessage from 'messages/walletMessage';
import { useEffectOnce } from 'react-use';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import initIm from 'hooks/im';
import { sleep } from '@portkey-wallet/utils';
import { useDiscoverGroupList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useManagerExceedTipModal } from 'hooks/useManagerExceedTip';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import HomeHeader from 'pages/components/HomeHeader';
import BottomBar from 'pages/components/BottomBar';
import SetNewWalletNameModal from './components/SetNewWalletNameModal';
import { useBlockAndReport } from '@portkey-wallet/hooks/hooks-ca/im';
import { store } from 'store/Provider/store';

export default function Home() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const isImputation = useIsImputation();
  const { getViewReferralStatusStatus, getReferralLink, viewReferralStatus } = useReferral();
  const onUserClick = useCallback(() => {
    const url = isNotLessThan768 ? `/setting/wallet` : `/setting`;
    navigate(url);
  }, [isNotLessThan768, navigate]);
  useDiscoverGroupList();
  const managerExceedTip = useManagerExceedTipModal();
  const { search } = useLocation();
  const isSell = useRef(0); // guaranteed to make only one transfer
  const handleAchSell = useHandleAchSell();
  const locked = useStorage('locked');
  const { fetchAndSetBlockList } = useBlockAndReport();

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
    managerExceedTip();
    getViewReferralStatusStatus();
    getReferralLink();
    fetchAndSetBlockList();
  });
  initIm();
  console.log('wallet data', JSON.stringify(store.getState().wallet));
  return (
    <div className={clsx(['portkey-home', 'flex-column', isPrompt && 'portkey-prompt'])}>
      {isPrompt && isNotLessThan768 ? (
        <PortKeyHeader unReadShow={isImputation || !viewReferralStatus} onUserClick={onUserClick} />
      ) : (
        <HomeHeader unReadShow={isImputation || !viewReferralStatus} onUserClick={onUserClick} />
      )}
      <div className={clsx('portkey-body', isPrompt ? '' : 'flex-1')}>
        <MyBalance />
      </div>
      {!isPrompt && <BottomBar />}
      <SetNewWalletNameModal />
    </div>
  );
}
