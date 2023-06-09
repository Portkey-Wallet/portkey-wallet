import clsx from 'clsx';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import popupHandler from 'utils/popupHandler';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import MyBalance from './components/MyBalance';
import './index.less';
import qs from 'query-string';
import { useHandleAchSell } from 'pages/Buy/hooks/useHandleAchSell';
import { useStorage } from 'hooks/useStorage';

export default function Home() {
  const navigate = useNavigate();
  const { isPopupInit, isPrompt, isNotLessThan768 } = useCommonState();

  const onUserClick = useCallback(() => {
    const url = isNotLessThan768 ? `/setting/wallet` : `/setting`;
    navigate(url);
  }, [isNotLessThan768, navigate]);

  const { setLoading } = useLoading();
  const { search } = useLocation();
  const isSell = useRef(0); // guaranteed to make only one transfer
  const handleAchSell = useHandleAchSell();
  const locked = useStorage('locked');

  useEffect(() => {
    if (search) {
      const { detail } = qs.parse(search);
      // if (detail) {
      // // TODO SELL LOCKED
      // }
      if (detail && !locked && isSell.current === 0) {
        console.log('🌹 🌹 🌹', '');
        isSell.current = 1;
        handleAchSell(detail);
      }
    }
  }, [handleAchSell, locked, search]);

  const getLocationState = useCallback(async () => {
    try {
      if (!isPopupInit) return;
      setLoading(1);
      const isExpire = await popupHandler.popupActive();
      if (isExpire) {
        setLoading(false);
        return navigate('/');
      }

      const lastLocationState = await getLocalStorage('lastLocationState');
      setLoading(false);
      if (!lastLocationState?.path) {
        lastLocationState.path = '/';
      }
      navigate(lastLocationState.path, { state: lastLocationState.state });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [isPopupInit, navigate, setLoading]);

  useEffect(() => {
    getLocationState();
  }, [getLocationState, setLoading]);

  return (
    <div className={clsx(['portkey-home', isPrompt ? 'portkey-prompt' : null])}>
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-body">
        <MyBalance />
      </div>
    </div>
  );
}
