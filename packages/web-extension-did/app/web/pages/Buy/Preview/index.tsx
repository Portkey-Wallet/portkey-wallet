import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { initPreviewData, InitProviderSelected, MAX_UPDATE_TIME } from '../const';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import {
  ACH_MERCHANT_NAME,
  DISCLAIMER_TEXT,
  SERVICE_UNAVAILABLE_TEXT,
} from '@portkey-wallet/constants/constants-ca/ramp';
import clsx from 'clsx';
import CustomModal from 'pages/components/CustomModal';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import './index.less';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { ACH_WITHDRAW_URL } from 'constants/index';
import { generateRateText, generateReceiveText } from '../utils';
import { ITransDirectEnum, RampType } from '@portkey-wallet/ramp';
import { IGetBuyDetail, IGetSellDetail, getBuyDetail, getOrderNo, getSellDetail } from '@portkey-wallet/utils/ramp';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const updateRef = useRef(MAX_UPDATE_TIME);
  const [receive, setReceive] = useState('1');
  const [rate, setRate] = useState('1');
  const { setLoading } = useLoading();
  const wallet = useCurrentWalletInfo();
  const { refreshRampShow } = useRampEntryShow();

  const [providerList, setProviderList] = useState<Array<IGetBuyDetail | IGetSellDetail>>([]);
  const [providerSelected, setProviderSelected] = useState<IGetBuyDetail | IGetSellDetail>(InitProviderSelected);

  const data = useMemo(() => ({ ...initPreviewData, ...state }), [state]);
  const showRateText = useMemo(() => generateRateText(data.crypto, rate, data.fiat), [data.crypto, data.fiat, rate]);
  const receiveText = useMemo(
    () => generateReceiveText(receive, data.side === RampType.BUY ? data.crypto : data.fiat),
    [data.crypto, data.fiat, data.side, receive],
  );

  const onSwitchProvider = useCallback((provider: IGetBuyDetail | IGetSellDetail) => {
    setProviderSelected(provider);
    setReceive(provider.amount);
    setRate(provider.exchange);
  }, []);

  const getRampDetail = useCallback(async () => {
    try {
      let canUseProviders: Array<IGetBuyDetail | IGetSellDetail> = [];
      if (data.side === RampType.BUY) {
        canUseProviders = await getBuyDetail({
          network: state.network,
          crypto: state.crypto,
          fiat: state.fiat,
          country: state.country,
          fiatAmount: state.amount,
        });
      } else {
        canUseProviders = await getSellDetail({
          network: state.network,
          crypto: state.crypto,
          fiat: state.fiat,
          country: state.country,
          cryptoAmount: state.amount,
        });
      }

      setProviderList(canUseProviders);
      const providerSelectedExit = canUseProviders.filter((item) => item.thirdPart === providerSelected.thirdPart);

      if (providerSelectedExit.length === 0) {
        // providerSelected not exit
        setProviderSelected(canUseProviders[0]);
        setReceive(canUseProviders[0].amount);
        setRate(canUseProviders[0].exchange);
      } else {
        setProviderSelected(providerSelectedExit[0]);
        setReceive(providerSelectedExit[0].amount);
        setRate(providerSelectedExit[0].exchange);
      }
    } catch (error) {
      message.error(handleErrorMessage(error));
    }
  }, [data.side, providerSelected.thirdPart, state.amount, state.country, state.crypto, state.fiat, state.network]);

  useEffect(() => {
    getRampDetail();
  }, [getRampDetail]);

  useEffect(() => {
    const timer = setInterval(() => {
      --updateRef.current;
      if (updateRef.current === 0) {
        getRampDetail();
        updateRef.current = MAX_UPDATE_TIME;
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPayPage = useCallback(async () => {
    const { side } = data;
    setLoading(true);
    const { isBuySectionShow, isSellSectionShow } = await refreshRampShow();
    // Compatible with the situation where the function is turned off when the user is on the page.
    if ((side === RampType.BUY && !isBuySectionShow) || (side === RampType.SELL && !isSellSectionShow)) {
      setLoading(false);
      message.error(SERVICE_UNAVAILABLE_TEXT);
      return navigate('/');
    }

    const appId = providerSelected.providerInfo.appId;
    const baseUrl = providerSelected.providerInfo.baseUrl;
    const callbackUrl = providerSelected.providerInfo.callbackUrl;
    if (!appId || !baseUrl) return setLoading(false);
    try {
      const { network, country, fiat, amount, crypto } = data;
      let achUrl = `${baseUrl}/?crypto=${crypto}&network=${network}&country=${country}&fiat=${fiat}&appId=${appId}&callbackUrl=${encodeURIComponent(
        `${callbackUrl}`,
      )}`;

      const orderNo = await getOrderNo({
        transDirect: side === RampType.BUY ? ITransDirectEnum.TOKEN_BUY : ITransDirectEnum.TOKEN_SELL,
        merchantName: ACH_MERCHANT_NAME,
      });
      achUrl += `&merchantOrderNo=${orderNo}`;

      if (side === RampType.BUY) {
        achUrl += `&type=buy&fiatAmount=${amount}`;

        const achTokenInfo = { token: '' }; // TODO
        if (achTokenInfo !== undefined) {
          achUrl += `&token=${encodeURIComponent(achTokenInfo.token)}`;
        }

        const address = wallet?.AELF?.caAddress || '';
        const signature = address; // TODO
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
  }, [
    data,
    navigate,
    providerSelected.providerInfo.appId,
    providerSelected.providerInfo.baseUrl,
    providerSelected.providerInfo.callbackUrl,
    refreshRampShow,
    setLoading,
    wallet?.AELF?.caAddress,
  ]);

  const showDisclaimerTipModal = useCallback(() => {
    CustomModal({
      content: (
        <>
          <div className="title">Disclaimer</div>
          {providerSelected?.providerInfo.name + DISCLAIMER_TEXT}
        </>
      ),
    });
  }, [providerSelected?.providerInfo.name]);

  const handleBack = useCallback(() => {
    navigate('/buy', { state: state });
  }, [navigate, state]);

  const mainContent = useMemo(
    () => (
      <div className={clsx(['preview-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <div className="preview-title">
          <BackHeader
            title={`${data.side === RampType.BUY ? 'Buy' : 'Sell'} ${state.crypto}`}
            leftCallBack={handleBack}
            rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
          />
        </div>

        <div className="preview-content">
          <div className="transaction flex-column-center">
            <div className="send">
              <span className="amount">{formatAmountShow(data.amount)}</span>
              <span className="currency">{data.side === RampType.BUY ? data.fiat : data.crypto}</span>
            </div>
            <div className="receive">{receiveText}</div>
          </div>
          <div className="card">
            <div className="label">{t('Service provider')}</div>
            {providerList.map((item) => (
              <div
                className={clsx([
                  'card-item',
                  providerSelected?.providerInfo.key === item?.providerInfo.key && 'card-item-selected',
                  'flex-column',
                ])}
                key={item?.providerInfo.key}
                onClick={() => onSwitchProvider(item)}>
                <div className="flex-row-center ramp-provider">
                  <img src={item?.providerInfo.logo} className="ramp-provider-logo" />
                  <div className="rate">{showRateText}</div>
                </div>
                <div className="ramp-provider-pay">
                  {item?.providerInfo.paymentTags.map((tag, index) => (
                    <img src={tag} key={'paymentTags-' + index} className="ramp-provider-pay-item" />
                  ))}
                </div>
                {providerSelected?.providerInfo.key === item?.providerInfo.key && (
                  <CustomSvg type="CardSelected" className="card-selected-icon" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="preview-footer">
          <div className="disclaimer">
            <span>
              Proceeding with this transaction means that you have read and understood
              <span className="highlight" onClick={showDisclaimerTipModal}>
                &nbsp;the Disclaimer
              </span>
              .
            </span>
          </div>
          <Button type="primary" htmlType="submit" onClick={goPayPage}>
            {'Go to ' + providerSelected?.providerInfo.name}
          </Button>
        </div>
        {isPrompt && <PromptEmptyElement />}
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
      onSwitchProvider,
      providerList,
      providerSelected?.providerInfo.key,
      providerSelected?.providerInfo.name,
      receiveText,
      showDisclaimerTipModal,
      showRateText,
      state.crypto,
      t,
    ],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
