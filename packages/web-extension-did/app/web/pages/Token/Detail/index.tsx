import { useLocation, useNavigate } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice, useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/payment';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useExtensionBuyButtonShow, useExtensionETransShow } from 'hooks/cms';
import { ETransType } from 'types/eTrans';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import './index.less';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function TokenDetail() {
  const navigate = useNavigate();
  const { state: currentToken } = useLocation();
  const isMainNet = useIsMainnet();
  const { checkDappIsConfirmed } = useDisclaimer();
  const checkSecurity = useCheckSecurity();
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const { eTransUrl = '' } = useCurrentNetworkInfo();
  const { isPrompt } = useCommonState();
  const { isBuyButtonShow } = useExtensionBuyButtonShow();
  const isShowBuyEntry = useMemo(
    () => currentToken.symbol === 'ELF' && currentToken.chainId === 'AELF' && isBuyButtonShow,
    [currentToken.chainId, currentToken.symbol, isBuyButtonShow],
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
      const isSafe = await checkSecurity(currentToken.chainId);
      if (!isSafe) return;
      const targetUrl = stringifyETrans({
        url: eTransUrl || '',
        query: {
          tokenSymbol: currentToken.symbol,
          type: eTransType,
          chainId: currentToken.chainId,
        },
      });
      if (checkDappIsConfirmed(eTransUrl)) {
        const openWinder = window.open(targetUrl, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
      } else {
        disclaimerData.current = {
          targetUrl,
          originUrl: eTransUrl,
          originTitle: 'ETransfer',
          titleText: 'You will be directed to a third-party DApp: ETransfer',
        };
        setDisclaimerOpen(true);
      }
    },
    [checkDappIsConfirmed, checkSecurity, currentToken.chainId, currentToken.symbol, eTransUrl],
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
              isShowBuyEntry={isShowBuyEntry}
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
    isShowBuyEntry,
    handleBuy,
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
