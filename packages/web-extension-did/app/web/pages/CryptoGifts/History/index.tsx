import CommonHeader from 'components/CommonHeader';
import { useNavigate } from 'react-router';
import HistoryBox from '../components/HistoryBox';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import { useEffect, useMemo } from 'react';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { useGetCryptoGiftHistories } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import './index.less';

export default function HistoryList() {
  const { isPrompt } = useCommonState();
  const { cryptoGiftHistories, loading } = useGetCryptoGiftHistories();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);
  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gifts-history-list', 'flex-column', isPrompt && 'prompt-page')}>
        <CommonHeader title="History" onLeftBack={() => navigate('/crypto-gifts')} />
        <div className="history-list flex-column">
          {(cryptoGiftHistories ?? []).map((item, index) => (
            <HistoryBox key={index} {...item} onClick={() => navigate('/crypto-gifts/detail')} />
          ))}
        </div>
      </div>
    ),
    [cryptoGiftHistories, isPrompt, navigate],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
