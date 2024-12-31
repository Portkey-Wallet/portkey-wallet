import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonHeader from 'components/CommonHeader';
import { useNavigate } from 'react-router';
import { InitProviderSelected, MAX_UPDATE_TIME } from '../const';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCommonState, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { DISCLAIMER_TEXT, SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import clsx from 'clsx';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import './index.less';
import { ACH_WITHDRAW_URL } from 'constants/index';
import { generateRateText, generateReceiveText } from '../utils';
import ramp, { IRampProviderType, RampType } from '@portkey-wallet/ramp';
import { IGetBuyDetail, IGetSellDetail, getBuyDetail, getSellDetail } from '@portkey-wallet/utils/ramp';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { useLocationState } from 'hooks/router';
import { TRampPreviewLocationState } from 'types/router';
import { chromeStorage } from 'store/utils';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import {
  CommonModal,
  CommonButton,
  CommonPromptCard,
  ThrottleButton,
  PortkeyStyleProvider,
  CustomSvg,
} from '@portkey/did-ui-react';
import { PromptCardType } from 'pages/Send';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocationState<TRampPreviewLocationState>();
  const { isPrompt } = useCommonState();
  const updateRef = useRef(MAX_UPDATE_TIME);
  const [receive, setReceive] = useState('1');
  const { setLoading } = useLoading();
  const wallet = useCurrentWalletInfo();
  const { refreshRampShow } = useExtensionRampEntryShow();

  const [providerList, setProviderList] = useState<Array<IGetBuyDetail | IGetSellDetail>>([]);
  const [providerSelected, setProviderSelected] = useState<IGetBuyDetail | IGetSellDetail>(InitProviderSelected);
  const providerSelectedKey = useRef<IRampProviderType>(InitProviderSelected.thirdPart);
  const [openDisclaimerTipModal, setOpenDisclaimerTipModal] = useState<boolean>(false);

  const data = useMemo(() => ({ ...state }), [state]);
  const receiveText = useMemo(
    () => receive && generateReceiveText(receive, data.side === RampType.BUY ? data.crypto : data.fiat),
    [data.crypto, data.fiat, data.side, receive],
  );
  const disabled = useMemo(
    () => providerList.length > 0 && !!providerSelected?.thirdPart,
    [providerList.length, providerSelected?.thirdPart],
  );

  const onSwitchProvider = useCallback((provider: IGetBuyDetail | IGetSellDetail) => {
    providerSelectedKey.current = provider.thirdPart;
    setProviderSelected(provider);
    setReceive(provider.amount);
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
      const providerSelectedExit = canUseProviders.filter((item) => item?.thirdPart === providerSelectedKey.current);
      if (providerSelectedExit.length === 0) {
        // providerSelected not exit
        onSwitchProvider(canUseProviders[0]);
      } else {
        onSwitchProvider(providerSelectedExit[0]);
      }
    } catch (error) {
      console.log('getRampDetail error:', error);
    }
  }, [data.side, onSwitchProvider, state.amount, state.country, state.crypto, state.fiat, state.network]);

  useEffect(() => {
    getRampDetail();
  }, [getRampDetail, state]);

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

  const { userGuardiansList } = useGuardiansInfo();

  const goPayPage = useCallback(async () => {
    if (!providerSelected?.providerInfo) return;
    const { side } = data;
    setLoading(true);
    const { isBuySectionShow, isSellSectionShow } = await refreshRampShow();
    // Compatible with the situation where the function is turned off when the user is on the page.
    if ((side === RampType.BUY && !isBuySectionShow) || (side === RampType.SELL && !isSellSectionShow)) {
      setLoading(false);
      singleMessage.error(SERVICE_UNAVAILABLE_TEXT);
      return navigate('/');
    }

    try {
      const provider = ramp.getProvider(providerSelected.providerInfo.key);
      if (!provider) throw new Error('Failed to get ramp provider');

      if (userGuardiansList === undefined) {
        throw new Error('userGuardiansList is undefined');
      }
      const emailGuardian = userGuardiansList?.find(
        (item) => item.guardianType === LoginType.Email && item.isLoginAccount,
      );

      const { country, fiat, amount, crypto } = data;
      const { url, orderId } = await provider.createOrder({
        type: side,
        address: wallet?.AELF?.caAddress || '',
        email: emailGuardian?.guardianAccount,
        crypto: providerSelected.providerSymbol || crypto,
        network: providerSelected.providerNetwork,
        country: country,
        fiat: fiat,
        amount: amount,
        withdrawUrl: ACH_WITHDRAW_URL,
      });
      if (Array.isArray(state?.approveList) && state?.approveList.length > 0) {
        chromeStorage.setItem(`RampSellApproveList_${orderId}`, JSON.stringify(state.approveList));
      }

      console.log('go to pay url: ', url);
      const openWinder = window.open(url, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
      await sleep(500);
      navigate('/');
    } catch (error) {
      singleMessage.error('There is a network error, please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    data,
    navigate,
    providerSelected.providerInfo,
    providerSelected.providerNetwork,
    providerSelected.providerSymbol,
    refreshRampShow,
    setLoading,
    state.approveList,
    userGuardiansList,
    wallet?.AELF?.caAddress,
  ]);

  const showDisclaimerTipModal = useCallback(() => {
    setOpenDisclaimerTipModal(true);
  }, []);
  const handleBack = useCallback(() => {
    // from receive buy
    // if (state.mainPageInfo?.pageName === ReceiveTabEnum.Buy) {
    //   const _tokenInfo = state.tokenInfo;
    //   const receiveInfo: TReceiveLocationState = {
    //     chainId: _tokenInfo?.chainId ?? 'AELF',
    //     symbol: _tokenInfo?.symbol ?? '',
    //     balance: _tokenInfo?.balance ?? '',
    //     imageUrl: _tokenInfo?.imageUrl ?? '',
    //     address: _tokenInfo?.tokenContractAddress ?? '',
    //     decimals: _tokenInfo?.decimals ?? '',
    //     pageSide: ReceiveTabEnum.Buy,
    //     extraData: {
    //       fiat: state.fiat,
    //       crypto: state.crypto,
    //       amount: state.amount,
    //     },
    //   };
    //   navigate(`/receive/token/${state.crypto}`, {
    //     state: receiveInfo,
    //   });
    //   return;
    // }
    // navigate('/buy', { state: state });
    navigate(-1);
  }, [navigate]);

  const renderProviderList = useMemo(() => {
    return providerList.length > 0 ? (
      <div className="portkey-ui-ramp-provider-card">
        <div className="portkey-ui-ramp-provider-label">{t('Select provider:')}</div>
        {providerList.map((item) => (
          <div
            className={clsx([
              'portkey-ui-ramp-provider-card-item',
              providerSelected?.providerInfo.key === item?.providerInfo.key &&
                'portkey-ui-ramp-provider-card-item-selected',
              'portkey-ui-flex-column',
            ])}
            key={item?.providerInfo.key}
            onClick={() => onSwitchProvider(item)}>
            <div className="portkey-ui-flex-row-center portkey-ui-ramp-provider">
              <img src={item?.providerInfo.logo} className="portkey-ui-ramp-provider-logo" />
              <div className="rate">{generateRateText(data.crypto, item.exchange, data.fiat)}</div>
            </div>
            <div className="portkey-ui-ramp-provider-pay">
              {item?.providerInfo.paymentTags.map((tag, index) => (
                <img src={tag} key={'paymentTags-' + index} className="portkey-ui-ramp-provider-pay-item" />
              ))}
            </div>
            {providerSelected?.providerInfo.key === item?.providerInfo.key && (
              <CustomSvg type="CheckCircle" className="card-selected-icon" />
            )}
          </div>
        ))}
      </div>
    ) : null;
  }, [data.crypto, data.fiat, onSwitchProvider, providerList, providerSelected?.providerInfo.key, t]);

  const renderFooter = useMemo(() => {
    return providerSelected?.providerInfo.name ? (
      // TODO footer
      <div className="portkey-ui-ramp-preview-footer">
        <CommonPromptCard
          className="portkey-ui-ramp-preview-disclaimer"
          type={PromptCardType.INFO}
          description={
            <span>
              By proceeding, you acknowledge that you have read and understood the
              <span className="highlight" onClick={showDisclaimerTipModal}>
                &nbsp;Disclaimer
              </span>
              .
            </span>
          }
        />
        <ThrottleButton type="primary" htmlType="submit" onClick={goPayPage} disabled={!disabled} block>
          {data.side === RampType.BUY ? 'Buy' : 'Sell'}
        </ThrottleButton>
      </div>
    ) : null;
  }, [disabled, goPayPage, data.side, providerSelected?.providerInfo.name, showDisclaimerTipModal]);

  const mainContent = useMemo(
    () => (
      <PortkeyStyleProvider>
        <div className={clsx(['portkey-ui-ramp-preview-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
          <CommonHeader
            title={`${data.side === RampType.BUY ? 'Buy' : 'Sell'} ${state.crypto}`}
            onLeftBack={handleBack}
          />
          <div className="portkey-ui-ramp-preview-content">
            <div className="transaction portkey-ui-flex-column-center">
              <div className="send">
                <span className="amount">{formatAmountShow(data.amount)}</span>
                <span className="currency">{data.side === RampType.BUY ? data.fiat : data.crypto}</span>
              </div>
              <div className="receive">{receiveText}</div>
            </div>
            {renderProviderList}
          </div>
          {renderFooter}
          <CommonModal
            className="disclaimer-tip-modal"
            height={'auto'}
            open={openDisclaimerTipModal}
            onClose={() => {
              setOpenDisclaimerTipModal(false);
            }}>
            <div className="disclaimer-tip-wrapper">
              <div className="disclaimer-tip-title">Disclaimer</div>
              <span className="disclaimer-tip-content">
                {providerSelected?.providerInfo.name +
                  DISCLAIMER_TEXT +
                  providerSelected?.providerInfo.name +
                  ' services.'}
              </span>
              <CommonButton
                type="primary"
                block
                onClick={() => {
                  setOpenDisclaimerTipModal(false);
                }}>
                Close
              </CommonButton>
            </div>
          </CommonModal>
        </div>
      </PortkeyStyleProvider>
    ),
    [
      data.amount,
      data.crypto,
      data.fiat,
      data.side,
      handleBack,
      isPrompt,
      openDisclaimerTipModal,
      providerSelected?.providerInfo.name,
      receiveText,
      renderFooter,
      renderProviderList,
      state.crypto,
    ],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
