import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Radio, RadioChangeEvent } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { countryCodeMap } from '@portkey-wallet/constants/constants-ca/payment';
import {
  curFiat,
  curToken,
  MAX_UPDATE_TIME,
  PageType,
  payment,
  receive,
  sellSoonText,
  showRateText,
  testnetTip,
} from './const';
import PromptFrame from 'pages/components/PromptFrame';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import CustomModal from 'pages/components/CustomModal';
import './index.less';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const timerRef = useRef<NodeJS.Timer | number>();
  const [rateUpdateTime, setRateUpdateTime] = useState(MAX_UPDATE_TIME);

  const handlePageChange = useCallback((e: RadioChangeEvent) => {
    if (e.target.value === PageType.sell) {
      CustomModal({
        content: sellSoonText,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (rateUpdateTime === 0) {
        setRateUpdateTime(MAX_UPDATE_TIME);
      } else {
        setRateUpdateTime(rateUpdateTime - 1);
      }
    }, 1000);
    timerRef.current = timer;
    return () => {
      clearInterval(timerRef.current);
    };
  }, [rateUpdateTime]);

  const renderTokenInput = useMemo(() => {
    return (
      <Input
        value={receive}
        readOnly
        suffix={
          <>
            <CustomSvg type="elf-icon" />
            <div className="currency">{curToken.symbol}</div>
          </>
        }
      />
    );
  }, []);

  const renderCurrencyInput = useMemo(() => {
    return (
      <Input
        value={payment}
        autoComplete="off"
        readOnly
        suffix={
          <>
            <div className="img">
              <img src={countryCodeMap[curFiat.country || ''].icon} alt="" />
            </div>
            <div className="currency">{curFiat.currency}</div>
          </>
        }
      />
    );
  }, []);

  const handleNext = useCallback(() => {
    navigate('/buy-test/preview', { state: state });
  }, [navigate, state]);

  const handleBack = useCallback(() => {
    if (state && state.tokenInfo) {
      navigate('/token-detail', { state: state.tokenInfo });
    } else {
      navigate('/');
    }
  }, [navigate, state]);

  const mainContent = useMemo(
    () => (
      <div className={clsx(['buy-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <div className="buy-title">
          <BackHeader
            title={t('Buy')}
            leftCallBack={handleBack}
            rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
          />
        </div>
        <div className="buy-content flex-column-center">
          <div className="buy-radio">
            <Radio.Group
              defaultValue={PageType.buy}
              buttonStyle="solid"
              value={PageType.buy}
              onChange={handlePageChange}>
              <Radio.Button value={PageType.buy}>{t('Buy')}</Radio.Button>
              <Radio.Button value={PageType.sell}>{t('Sell')}</Radio.Button>
            </Radio.Group>
          </div>
          <div className="buy-input">
            <div className="label">I want to pay</div>
            {renderCurrencyInput}
          </div>
          <div className="buy-input">
            <div className="label">I will receive ≈</div>
            {renderTokenInput}
          </div>
          <div className="buy-rate flex-between-center">
            <div>{showRateText}</div>
            <div className="timer flex-center">
              <CustomSvg type="Timer" />
              <div className="timestamp">{rateUpdateTime}s</div>
            </div>
          </div>
        </div>
        <div>
          <div className="testnet-tip">{testnetTip}</div>
          <div className="buy-footer">
            <Button type="primary" htmlType="submit" onClick={handleNext}>
              {t('Next')}
            </Button>
          </div>
        </div>
      </div>
    ),
    [handleBack, handleNext, handlePageChange, isPrompt, rateUpdateTime, renderCurrencyInput, renderTokenInput, t],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
