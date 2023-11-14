import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, RadioChangeEvent } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import './index.less';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import BuyForm from './components/BuyForm';
import SellForm from './components/SellForm';
import { useEffectOnce } from 'react-use';
import CustomTipModal from 'pages/components/CustomModal';
import { BUY_SOON_TEXT, SELL_SOON_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { RampType } from '@portkey-wallet/ramp';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();

  const [page, setPage] = useState<RampType>(RampType.BUY);

  const { isBuySectionShow, isSellSectionShow, refreshRampShow } = useRampEntryShow();

  useFetchTxFee();

  useEffectOnce(() => {
    // TODO token detail
    if (!isBuySectionShow && isSellSectionShow) {
      const side = RampType.SELL;
      setPage(side);
    }
  });

  const handlePageChange = useCallback(
    async (e: RadioChangeEvent) => {
      refreshRampShow(); // fetch on\off ramp is display

      const side = e.target.value;
      // Compatible with the situation where the function is turned off when the user is on the page.
      if (side === RampType.BUY && !isBuySectionShow) {
        CustomTipModal({
          content: t(BUY_SOON_TEXT),
        });
        return;
      }
      if (side === RampType.SELL && !isSellSectionShow) {
        CustomTipModal({
          content: t(SELL_SOON_TEXT),
        });
        return;
      }

      // stopInterval();
      setPage(side);
    },
    [isBuySectionShow, isSellSectionShow, refreshRampShow, t],
  );

  const handleBack = useCallback(() => {
    if (state && state.tokenInfo) {
      navigate('/token-detail', {
        state: state.tokenInfo,
      });
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
            <Radio.Group defaultValue={RampType.BUY} buttonStyle="solid" value={page} onChange={handlePageChange}>
              <Radio.Button value={RampType.BUY}>{t('Buy')}</Radio.Button>
              <Radio.Button value={RampType.SELL}>{t('Sell')}</Radio.Button>
            </Radio.Group>
          </div>
          {page === RampType.BUY && <BuyForm />}
          {page === RampType.SELL && <SellForm />}
        </div>
        {isPrompt && <PromptEmptyElement />}
      </div>
    ),
    [handleBack, handlePageChange, isPrompt, page, t],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
