import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, RadioChangeEvent } from 'antd';
import CommonHeader from 'components/CommonHeader';
import { useNavigate } from 'react-router';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import './index.less';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import BuyForm from './components/BuyForm';
import SellForm from './components/SellForm';
import { useEffectOnce } from 'react-use';
import CustomTipModal from 'pages/components/CustomModal';
import { RampType } from '@portkey-wallet/ramp';
import { BUY_SOON_TEXT, SELL_SOON_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useCheckSecurity } from 'hooks/useSecurity';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams } from 'hooks/router';
import { TRampLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locationParams: state } = usePromptLocationParams<TRampLocationState, TRampLocationState>();
  const { isPrompt } = useCommonState();
  const { setLoading } = useLoading();
  const checkSecurity = useCheckSecurity();

  const [page, setPage] = useState<RampType>(state?.side || RampType.BUY);

  const { isBuySectionShow, isSellSectionShow, refreshRampShow } = useExtensionRampEntryShow();

  useFetchTxFee();

  useEffectOnce(() => {
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

      // CHECK 2: security
      if (side === RampType.SELL) {
        try {
          setLoading(true);
          const securityRes = await checkSecurity(MAIN_CHAIN_ID);
          setLoading(false);
          if (!securityRes) return;
        } catch (error) {
          setLoading(false);
          singleMessage.error(handleErrorMessage(error));
        }
      }

      // stopInterval();
      setPage(side);
    },
    [checkSecurity, isBuySectionShow, isSellSectionShow, refreshRampShow, setLoading, t],
  );

  const handleBack = useCallback(() => {
    if (state) {
      if (state.mainPageInfo?.pageName === 'crypto-gift') {
        navigate('/crypto-gifts/create');
        return;
      }
      if (state.tokenInfo) {
        navigate('/token-detail', {
          state: state.tokenInfo,
        });
        return;
      }
      navigate('/');
    } else {
      navigate('/');
    }
  }, [navigate, state]);

  const mainContent = useMemo(
    () => (
      <div className={clsx(['buy-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <CommonHeader title={t('Buy')} onLeftBack={handleBack} />
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
