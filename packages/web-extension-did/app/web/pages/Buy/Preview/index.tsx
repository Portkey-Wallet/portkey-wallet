import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { disclaimer, initPreviewData, MAX_UPDATE_TIME } from '../const';
import { getAchSignature, getOrderQuote, getPaymentOrderNo } from '@portkey-wallet/api/api-did/payment/util';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { ACH_MERCHANT_NAME, TransDirectEnum } from '@portkey-wallet/constants/constants-ca/payment';
import clsx from 'clsx';
import { useGetAchTokenInfo } from '@portkey-wallet/hooks/hooks-ca/payment';
import paymentApi from '@portkey-wallet/api/api-did/payment';
import { useCurrentApiUrl, useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import CustomModal from 'pages/components/CustomModal';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import './index.less';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';
import { ACH_WITHDRAW_URL } from 'constants/index';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const updateRef = useRef(MAX_UPDATE_TIME);
  const [receive, setReceive] = useState('');
  const [rate, setRate] = useState('');
  const { setLoading } = useLoading();
  const wallet = useCurrentWalletInfo();
  const { buyConfig } = useCurrentNetworkInfo();

  const data = useMemo(() => ({ ...initPreviewData, ...state }), [state]);
  const showRateText = useMemo(() => `1 ${data.crypto} ≈ ${formatAmountShow(rate, 2)} ${data.fiat}`, [data, rate]);
  const receiveText = useMemo(
    () =>
      `I will receive ≈ ${formatAmountShow(receive)} ${data.side === PaymentTypeEnum.BUY ? data.crypto : data.fiat}`,
    [data, receive],
  );
  const apiUrl = useCurrentApiUrl();
  const getAchTokenInfo = useGetAchTokenInfo();

  const setReceiveCase = useCallback(
    ({
      fiatQuantity,
      rampFee,
      cryptoQuantity,
    }: {
      fiatQuantity?: string;
      rampFee: string;
      cryptoQuantity?: string;
    }) => {
      if (data.side === PaymentTypeEnum.SELL && fiatQuantity && rampFee) {
        const receive = Number(fiatQuantity) - Number(rampFee);
        setReceive(formatAmountShow(receive, 4));
      }
      if (data.side === PaymentTypeEnum.BUY) {
        setReceive(formatAmountShow(cryptoQuantity || '', 4));
      }
    },
    [data.side],
  );

  const updateReceive = useCallback(async () => {
    try {
      const rst = await getOrderQuote(data);
      const { cryptoPrice, fiatQuantity, rampFee, cryptoQuantity } = rst;
      setReceiveCase({ fiatQuantity, rampFee, cryptoQuantity });
      setRate(cryptoPrice);
    } catch (error) {
      console.log('error', error);
    }
  }, [data, setReceiveCase]);

  useEffect(() => {
    updateReceive();
  }, [updateReceive]);

  useEffect(() => {
    const timer = setInterval(() => {
      --updateRef.current;
      if (updateRef.current === 0) {
        updateReceive();
        updateRef.current = MAX_UPDATE_TIME;
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPayPage = useCallback(async () => {
    const appId = buyConfig?.ach?.appId;
    const baseUrl = buyConfig?.ach?.baseUrl;
    if (!appId || !baseUrl) return;
    try {
      setLoading(true);
      const { network, country, fiat, side, amount, crypto } = data;
      let achUrl = `${baseUrl}/?crypto=${crypto}&network=${network}&country=${country}&fiat=${fiat}&appId=${appId}&callbackUrl=${encodeURIComponent(
        `${apiUrl}${paymentApi.updateAchOrder}`,
      )}`;

      const orderNo = await getPaymentOrderNo({
        transDirect: side === 'BUY' ? TransDirectEnum.TOKEN_BUY : TransDirectEnum.TOKEN_SELL,
        merchantName: ACH_MERCHANT_NAME,
      });
      achUrl += `&merchantOrderNo=${orderNo}`;

      if (side === PaymentTypeEnum.BUY) {
        achUrl += `&type=buy&fiatAmount=${amount}`;

        const achTokenInfo = await getAchTokenInfo();
        if (achTokenInfo !== undefined) {
          achUrl += `&token=${encodeURIComponent(achTokenInfo.token)}`;
        }

        const address = wallet?.AELF?.caAddress || '';
        const signature = await getAchSignature({ address });
        achUrl += `&address=${address}&sign=${encodeURIComponent(signature)}`;
      } else {
        const withdrawUrl = encodeURIComponent(
          ACH_WITHDRAW_URL + `&payload=${encodeURIComponent(JSON.stringify({ orderNo: orderNo }))}`,
        );

        achUrl += `&type=sell&cryptoAmount=${amount}&withdrawUrl=${withdrawUrl}&source=3#/sell-formUserInfo`;
      }

      console.log('achUrl', achUrl);
      const openWinder = window.open(achUrl, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/');
    } catch (error) {
      message.error('There is a network error, please try again.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, buyConfig, data, getAchTokenInfo, navigate, setLoading, wallet?.AELF?.caAddress]);

  const showDisclaimerTipModal = useCallback(() => {
    CustomModal({
      content: (
        <>
          <div className="title">Disclaimer</div>
          {disclaimer}
        </>
      ),
    });
  }, []);

  const handleBack = useCallback(() => {
    navigate('/buy', { state: state });
  }, [navigate, state]);

  const mainContent = useMemo(
    () => (
      <div className={clsx(['preview-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <div className="preview-title">
          <BackHeader
            title={`${data.side === PaymentTypeEnum.BUY ? 'Buy' : 'Sell'} ${state.crypto}`}
            leftCallBack={handleBack}
            rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
          />
        </div>
        <div className="preview-content">
          <div className="transaction flex-column-center">
            <div className="send">
              <span className="amount">{formatAmountShow(data.amount)}</span>
              <span className="currency">{data.side === PaymentTypeEnum.BUY ? data.fiat : data.crypto}</span>
            </div>
            <div className="receive">{receiveText}</div>
          </div>
          <div className="card">
            <div className="label">{t('Service provider')}</div>
            <div className="card-item flex-column">
              <div className="flex-between-center ach">
                <CustomSvg type="BuyAch" />
                <div className="rate">{showRateText}</div>
              </div>
              <div className="ach-pay">
                <CustomSvg type="BUY-PAY" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="disclaimer">
            <span>
              Proceeding with this transaction means that you have read and understood
              <span className="highlight" onClick={showDisclaimerTipModal}>
                &nbsp;the Disclaimer
              </span>
              .
            </span>
          </div>
        </div>
        <div className="preview-footer">
          <Button type="primary" htmlType="submit" onClick={goPayPage}>
            {t('Go to AlchemyPay')}
          </Button>
        </div>
        {isPrompt ? <PromptEmptyElement /> : null}
      </div>
    ),
    [
      data.amount,
      data.crypto,
      data.fiat,
      data.side,
      goPayPage,
      handleBack,
      isPrompt,
      receiveText,
      showDisclaimerTipModal,
      showRateText,
      state.crypto,
      t,
    ],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
