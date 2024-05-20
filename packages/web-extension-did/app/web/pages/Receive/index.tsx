import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import PromptFrame from 'pages/components/PromptFrame';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import RadioTab from 'pages/components/RadioTab';
import QRCodePage from './QRCodePage';
import ExchangePage from './ExchangePage';
import { TReceiveLocationState } from 'types/router';
import { useLocationState } from 'hooks/router';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useExtensionETransShow } from 'hooks/cms';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { ALL_RECEIVE_TAB, ReceiveTabEnum } from '@portkey-wallet/constants/constants-ca/send';
import './index.less';

export default function Receive() {
  const navigate = useNavigate();
  const { isETransDepositShow } = useExtensionETransShow();
  const { isBuySectionShow } = useExtensionRampEntryShow();
  const { state } = useLocationState<TReceiveLocationState>();
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

  const rightElement = useMemo(() => {
    return (
      <div>
        <CustomSvg onClick={() => navigate(-1)} type="Close2" />
      </div>
    );
  }, [navigate]);

  const { isPrompt } = useCommonState();
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['receive-wrapper flex-column', isPrompt && 'detail-page-prompt'])}>
        <TitleWrapper leftElement rightElement={rightElement} />
        <div className="receive-content flex-1 flex-column">
          {showTabData.length > 1 ? (
            <RadioTab
              className="radio-tab-wrap"
              radioList={showTabData}
              onChange={(target) => {
                setCurTab(target as ReceiveTabEnum);
              }}
              defaultValue={curTab}
            />
          ) : null}
          <div className="receive-content-page flex-1"></div>
          {curTab === ReceiveTabEnum.QRCode && <QRCodePage />}
          {curTab === ReceiveTabEnum.Exchanges && <ExchangePage />}
          {curTab === ReceiveTabEnum.Deposit && <></>}
          {curTab === ReceiveTabEnum.Buy && <></>}
        </div>
        {isPrompt && <PromptEmptyElement />}
      </div>
    );
  }, [curTab, isPrompt, rightElement, showTabData]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
