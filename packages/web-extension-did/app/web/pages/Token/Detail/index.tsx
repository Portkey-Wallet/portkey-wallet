import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice, useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/wallet';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useExtensionETransShow } from 'hooks/cms';
import { ETransType } from 'types/eTrans';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import './index.less';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TSendLocationState, TTokenDetailLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { SHOW_RAMP_CHAIN_ID_LIST, SHOW_RAMP_SYMBOL_LIST } from '@portkey-wallet/constants/constants-ca/ramp';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

export type TTokenDetailNavigateState = {
  tokenInfo: TTokenDetailLocationState;
};

function TokenDetail() {
  const navigate = useNavigateState<TTokenDetailNavigateState | Partial<TSendLocationState>>();
  const { state: currentToken } = useLocationState<TTokenDetailLocationState>();
  const isMainNet = useIsMainnet();
  const { checkDappIsConfirmed } = useDisclaimer();
  const checkSecurity = useCheckSecurity();
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const { eTransferUrl = '' } = useCurrentNetworkInfo();
  const { isPrompt } = useCommonState();
  const { isRampShow } = useExtensionRampEntryShow();
  const { setLoading } = useLoading();
  const isShowBuy = useMemo(
    () =>
      SHOW_RAMP_SYMBOL_LIST.includes(currentToken.symbol) &&
      SHOW_RAMP_CHAIN_ID_LIST.includes(currentToken.chainId) &&
      isRampShow,
    [currentToken.chainId, currentToken.symbol, isRampShow],
  );
  const { isETransDepositShow, isETransWithdrawShow } = useExtensionETransShow();
  const isShowDepositUSDT = useMemo(
    () => currentToken.symbol === 'USDT' && isETransDepositShow,
    [currentToken.symbol, isETransDepositShow],
  );
  const isShowWithdrawUSDT = useMemo(
    () => currentToken.symbol === 'USDT' && isETransWithdrawShow,
    [currentToken.symbol, isETransWithdrawShow],
  );
  const defaultToken = useDefaultToken();
  const isShowFaucet = useMemo(
    () => !isMainNet && currentToken.symbol === defaultToken.symbol && currentToken.chainId === 'AELF',
    [currentToken.chainId, currentToken.symbol, defaultToken.symbol, isMainNet],
  );
  const amountInUsdShow = useAmountInUsdShow();
  useFreshTokenPrice();
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const handleBuy = useCallback(() => {
    if (isMainNet) {
      navigate('/buy', { state: { tokenInfo: currentToken } });
    } else {
      const openWinder = window.open(FAUCET_URL, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
    }
  }, [currentToken, isMainNet, navigate]);

  const handleClickETrans = useCallback(
    async (eTransType: ETransType) => {
      try {
        setLoading(true);
        const isSafe = await checkSecurity(currentToken.chainId);
        setLoading(false);
        if (!isSafe) return;
      } catch (error) {
        setLoading(false);
        console.log('===handleClickETrans error', error);
        return;
      }
      const targetUrl = stringifyETrans({
        url: eTransferUrl || '',
        query: {
          tokenSymbol: currentToken.symbol,
          type: eTransType,
          chainId: currentToken.chainId,
        },
      });
      if (checkDappIsConfirmed(eTransferUrl)) {
        const openWinder = window.open(targetUrl, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
      } else {
        disclaimerData.current = {
          targetUrl,
          originUrl: eTransferUrl,
          dappIcon: 'ETransFavicon',
          originTitle: 'ETransfer',
          titleText: 'You will be directed to a third-party DApp: ETransfer',
        };
        setDisclaimerOpen(true);
      }
    },
    [checkDappIsConfirmed, checkSecurity, currentToken.chainId, currentToken.symbol, eTransferUrl, setLoading],
  );
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['token-detail', isPrompt ? 'portkey-body' : ''])}>
        <div className="token-detail-title">
          <SettingHeader
            title={
              <div className="title">
                <p className="symbol">{currentToken?.symbol}</p>
                <p className="network">{transNetworkText(currentToken.chainId, !isMainNet)}</p>
              </div>
            }
            leftCallBack={() => navigate('/')}
          />
        </div>
        <div className="token-detail-content">
          <div className="balance">
            <div className="balance-amount">
              <span className="amount">
                {formatAmountShow(divDecimals(currentToken.balance, currentToken.decimals))} {currentToken.symbol}
              </span>
              {isMainNet && (
                <span className="convert">
                  {amountInUsdShow(currentToken.balance, currentToken.decimals, currentToken.symbol)}
                </span>
              )}
            </div>
            <BalanceCard
              amount={currentToken?.balanceInUsd}
              isShowDepositUSDT={isShowDepositUSDT}
              onClickDepositUSDT={() => handleClickETrans(ETransType.Deposit)}
              onClickWithdrawUSDT={() => handleClickETrans(ETransType.Withdraw)}
              isShowWithdrawUSDT={isShowWithdrawUSDT}
              isShowBuyEntry={isShowBuy}
              onBuy={handleBuy}
              onSend={async () => {
                navigate(`/send/token/${currentToken?.symbol}`, {
                  state: { ...currentToken, address: currentToken?.tokenContractAddress },
                });
              }}
              onReceive={() =>
                navigate(`/receive/token/${currentToken?.symbol}`, {
                  state: { ...currentToken, address: currentToken.tokenContractAddress },
                })
              }
              isShowFaucet={isShowFaucet}
            />
          </div>
        </div>
        <div className="token-detail-history">
          <Activity chainId={currentToken.chainId} symbol={currentToken.symbol} />
        </div>
      </div>
    );
  }, [
    isPrompt,
    currentToken,
    isMainNet,
    amountInUsdShow,
    isShowDepositUSDT,
    isShowWithdrawUSDT,
    isShowBuy,
    handleBuy,
    isShowFaucet,
    navigate,
    handleClickETrans,
  ]);

  return (
    <>
      {isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}
      <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />
    </>
  );
}

export default TokenDetail;
