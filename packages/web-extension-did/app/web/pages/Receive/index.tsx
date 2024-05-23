import clsx from 'clsx';
import CommonHeader from 'components/CommonHeader';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import PromptFrame from 'pages/components/PromptFrame';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import RadioTab from 'pages/components/RadioTab';
import QRCodePage from './QRCodePage';
import ExchangePage from './ExchangePage';
import DepositPage from './DepositPage';
import BuyPage from './BuyPage';
import { TReceiveLocationState } from 'types/router';
import { useLocationState } from 'hooks/router';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useExtensionETransShow } from 'hooks/cms';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { ALL_RECEIVE_TAB, ReceiveTabEnum } from '@portkey-wallet/constants/constants-ca/send';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';

export default function Receive() {
  const navigate = useNavigate();
  const { isETransDepositShow } = useExtensionETransShow();
  const { isBuySectionShow } = useExtensionRampEntryShow();
  const { state } = useLocationState<TReceiveLocationState>();
  const isMainnet = useIsMainnet();
  const dappShowFn = useMemo(
    () => checkEnabledFunctionalTypes(state.symbol, state.chainId === MAIN_CHAIN_ID),
    [state.chainId, state.symbol],
  );
  const showTabData = ALL_RECEIVE_TAB.filter((tab) => {
    if (tab.value === ReceiveTabEnum.QRCode) return true;
    if (tab.value === ReceiveTabEnum.Exchanges)
      return state.symbol === DEFAULT_TOKEN.symbol && state.chainId === MAIN_CHAIN_ID;
    if (tab.value === ReceiveTabEnum.Deposit) return dappShowFn.deposit && isETransDepositShow;
    if (tab.value === ReceiveTabEnum.Buy) return dappShowFn.buy && isBuySectionShow;
    return false;
  });
  const [curTab, setCurTab] = useState<ReceiveTabEnum>(showTabData[0].value);

  const { isPrompt } = useCommonState();

  useEffectOnce(() => {
    if (state?.receivePageSide) {
      setCurTab(state.receivePageSide);
    }
  });
  const headerTitle = useMemo(() => {
    return (
      <div>
        <div className="top-header flex-row-center">
          <TokenImageDisplay symbol={state.symbol} src={state.imageUrl} width={20} />
          <span>{state.symbol}</span>
        </div>
        <div className="bottom-header">{transNetworkText(state.chainId, !isMainnet)}</div>
      </div>
    );
  }, [isMainnet, state.chainId, state.imageUrl, state.symbol]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['receive-wrapper flex-column', isPrompt && 'detail-page-prompt'])}>
        <CommonHeader onLeftBack={() => navigate('/')} title={headerTitle} />
        <div className="receive-content flex-1 flex-column">
          {showTabData.length > 1 ? (
            <RadioTab
              className="receive-radio-tab"
              radioList={showTabData}
              onChange={(target) => {
                setCurTab(target as ReceiveTabEnum);
              }}
              activeValue={curTab}
              defaultValue={curTab}
            />
          ) : null}
          <div className="receive-content-page flex-1">
            {curTab === ReceiveTabEnum.QRCode && <QRCodePage />}
            {curTab === ReceiveTabEnum.Exchanges && <ExchangePage />}
            {curTab === ReceiveTabEnum.Deposit && <DepositPage />}
            {curTab === ReceiveTabEnum.Buy && <BuyPage />}
          </div>
        </div>
        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [curTab, headerTitle, isPrompt, navigate, showTabData]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
