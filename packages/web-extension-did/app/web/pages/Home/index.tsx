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

export default function Home() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();

  const onUserClick = useCallback(() => {
    const url = isNotLessThan768 ? `/setting/wallet` : `/setting`;
    navigate(url);
  }, [isNotLessThan768, navigate]);

  const { search } = useLocation();
  const isSell = useRef(0); // guaranteed to make only one transfer
  const handleAchSell = useHandleAchSell();
  const locked = useStorage('locked');

  const checkAchSell = useCallback(async () => {
    if (search) {
      const { detail, method } = qs.parse(search);
      if (detail && method === walletMessage.ACH_SELL_REDIRECT && !locked && isSell.current === 0) {
        history.replaceState(null, '', location.pathname);
        isSell.current = 1;
        await handleAchSell(detail);
      }
    }
  }, [handleAchSell, locked, search]);

  useEffectOnce(() => {
    checkAchSell();
  });

  return (
    <div className={clsx(['portkey-home', isPrompt ? 'portkey-prompt' : null])}>
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-body">
        <MyBalance />
      </div>
    </div>
  );
}
