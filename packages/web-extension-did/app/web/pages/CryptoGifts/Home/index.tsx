import { Button } from 'antd';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import { useMemo } from 'react';
import HistoryBox from '../components/HistoryBox';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { useGetFirstCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import './index.less';

// TODO mock
const ruleArr = [
  `• What is crypto gifts what is crypto gifts crypto gifts crypto gifts crypto gifts crypto gifts `,
  `• What is crypto gifts what is crypto gifts crypto gifts crypto gifts crypto gifts crypto gifts `,
  `• What is crypto gifts what is crypto gifts crypto gifts crypto gifts crypto gifts crypto gifts `,
];

export default function CryptoGifts() {
  const { isPrompt } = useCommonState();
  const navigate = useNavigate();
  const { firstCryptoGift } = useGetFirstCryptoGift();

  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gifts-page', 'flex-column', isPrompt && 'prompt-page')}>
        <CommonHeader onLeftBack={() => navigate('/')} />
        <div className="crypto-gifts-body flex-column-center">
          <div className="crypto-gifts-title flex-column-center">
            <div className="crypto-gifts-title-h1">Crypto Gifts</div>
            <div className="crypto-gifts-title-desc">Create and share crypto gifts with your friends</div>
          </div>
          <CustomSvg type="BoxOpen" className="crypto-gifts-icon" />
          <div className="crypto-gifts-btn">
            <Button type="primary" onClick={() => navigate('/crypto-gifts/create')}>
              Create Crypto Gifts
            </Button>
          </div>
          {firstCryptoGift && (
            <div className="crypto-gifts-history flex-column">
              <div className="history-title flex-between-center">
                <div className="title-left">History</div>
                <div className="title-right flex-row-center" onClick={() => navigate('/crypto-gifts/history')}>
                  <span>View all</span>
                  <CustomSvg type="iconRight" />
                </div>
              </div>
              <HistoryBox {...firstCryptoGift} />
            </div>
          )}
          <div className="crypto-gifts-rules flex-column">
            <div className="rules-label">Portkey Crypto Gifts Rules</div>
            <div className="rules-content flex-column">
              {ruleArr.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    [firstCryptoGift, isPrompt, navigate],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
