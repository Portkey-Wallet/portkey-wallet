import clsx from 'clsx';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import popupHandler from 'utils/popupHandler';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import MyBalance from './components/MyBalance';
import './index.less';

export default function Home() {
  const navigate = useNavigate();
  const { isPopupInit, isPrompt, isNotLessThan768 } = useCommonState();

  const onUserClick = useCallback(() => {
    const url = isNotLessThan768 ? `/setting/wallet` : `/setting`;
    navigate(url);
  }, [isNotLessThan768, navigate]);

  const { setLoading } = useLoading();
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
