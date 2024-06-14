import { Button } from 'antd';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import HistoryBox from '../components/HistoryBox';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { useGetFirstCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { useNavigateState } from 'hooks/router';
import { TCryptoGiftDetailLocationState } from 'types/router';
import { CRYPTO_GIFT_RULES } from '@portkey-wallet/constants/constants-ca/cryptoGift';
import './index.less';

export default function CryptoGifts() {
  const { isPrompt } = useCommonState();
  const navigate = useNavigateState<TCryptoGiftDetailLocationState>();
  const { firstCryptoGift } = useGetFirstCryptoGift();
  const handleClickCreate = useCallback(() => {
    if (isPrompt) {
      navigate('/crypto-gifts/create');
      return;
    }
    InternalMessage.payload(PortkeyMessageTypes.CRYPTO_GIFT).send();
  }, [isPrompt, navigate]);

  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gifts-page', 'flex-column', isPrompt && 'prompt-page')}>
        <CommonHeader onLeftBack={() => navigate('/')} />
        <div className="crypto-gifts-body flex-column-center">
          <div className="crypto-gifts-title flex-column-center">
            <div className="crypto-gifts-title-h1">Crypto Gift</div>
            <div className="crypto-gifts-title-desc">Send crypto assets as a gift</div>
          </div>
          <CustomSvg type="BoxOpen" className="crypto-gifts-icon" />
          <div className="crypto-gifts-btn">
            <Button type="primary" onClick={handleClickCreate}>
              Send Crypto Gift
            </Button>
          </div>
          {firstCryptoGift && firstCryptoGift.exist && (
            <div className="crypto-gifts-history flex-column">
              <div className="history-title flex-between-center">
                <div className="title-left">Crypto Gift Sent</div>
                <div className="title-right flex-row-center" onClick={() => navigate('/crypto-gifts/history')}>
                  <span>View All</span>
                  <CustomSvg type="iconRight" />
                </div>
              </div>
              <HistoryBox
                {...firstCryptoGift}
                onClick={() => navigate('/crypto-gifts/detail', { state: { id: firstCryptoGift.id } })}
              />
            </div>
          )}
          <div className="crypto-gifts-rules flex-column">
            <div className="rules-label">About Crypto Gift</div>
            <div className="rules-content flex-column">
              {CRYPTO_GIFT_RULES.map((item, index) => (
                <div key={index}>
                  <div className="rule-title">{`${index + 1}- ${item.title}`}</div>
                  <div>{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    [firstCryptoGift, handleClickCreate, isPrompt, navigate],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
