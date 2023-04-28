import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { payment, receiveText, visaCardNum, visaCardType } from '../const';
import PromptFrame from 'pages/components/PromptFrame';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import './index.less';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();

  const handleBack = useCallback(() => {
    navigate('/buy-test', { state: state });
  }, [navigate, state]);

  const handleProceed = useCallback(() => {
    navigate('/buy-test/confirm', { state: state });
  }, [navigate, state]);

  const mainContent = useMemo(
    () => (
      <div className={clsx(['preview-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <div className="preview-title">
          <BackHeader
            title="Buy ELF"
            leftCallBack={handleBack}
            rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
          />
        </div>
        <div className="preview-content">
          <div className="transaction flex-column-center">
            <div className="send">
              <span className="amount">{payment}</span>
              <span className="currency">USD</span>
            </div>
            <div className="receive">{receiveText}</div>
          </div>
          <div className="card">
            <div className="label">{t('Choose payment method')}</div>
            <div className="card-item visa flex">
              <CustomSvg type="BuyVisa" />
              <span className="card-type">{visaCardType}</span>
              <span className="card-number">{visaCardNum}</span>
            </div>
          </div>
        </div>
        <div className="preview-footer">
          <Button type="primary" htmlType="submit" onClick={handleProceed}>
            {t('Proceed')}
          </Button>
        </div>
      </div>
    ),
    [handleBack, handleProceed, isPrompt, t],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
