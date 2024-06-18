import CommonHeader from 'components/CommonHeader';
import HistoryBox from '../components/HistoryBox';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import { useEffect, useMemo } from 'react';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { useGetCryptoGiftHistories } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TCryptoGiftDetailLocationState } from 'types/router';
import './index.less';

export default function HistoryList() {
  const { isPrompt } = useCommonState();
  const { cryptoGiftHistories, loading, error } = useGetCryptoGiftHistories();
  const { setLoading } = useLoading();
  const navigate = useNavigateState<TCryptoGiftDetailLocationState>();
  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);
  useEffect(() => {
    error && singleMessage.error(handleErrorMessage(error));
  }, [error]);
  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gifts-history-list', 'flex-column', isPrompt && 'prompt-page')}>
        <CommonHeader title="History" onLeftBack={() => navigate('/crypto-gifts')} />
        <div className="history-list flex-column">
          {cryptoGiftHistories ? (
            cryptoGiftHistories.map((item, index) => (
              <HistoryBox
                key={index}
                {...item}
                onClick={() =>
                  navigate('/crypto-gifts/detail', { state: { id: item.id, fromPage: FromPageEnum.cryptoGiftHistory } })
                }
              />
            ))
          ) : (
            <div className="no-data-text">No data</div>
          )}
        </div>
      </div>
    ),
    [cryptoGiftHistories, isPrompt, navigate],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
