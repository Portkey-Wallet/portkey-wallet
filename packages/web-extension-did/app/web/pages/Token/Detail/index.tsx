import { useLocation, useNavigate } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useNetwork';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice, useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import './index.less';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function TokenDetail() {
  const navigate = useNavigate();
  const { state: currentToken } = useLocation();
  const isTestNet = useIsTestnet();
  const { isPrompt } = useCommonState();
  const isShowBuy = useMemo(() => currentToken.symbol === 'ELF' && currentToken.chainId === 'AELF', [currentToken]);
  const amountInUsdShow = useAmountInUsdShow();
  useFreshTokenPrice();

  const handleBuy = useCallback(() => {
    const path = isTestNet ? '/buy-test' : '/buy';
    navigate(path, { state: { tokenInfo: currentToken } });
  }, [currentToken, isTestNet, navigate]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['token-detail', isPrompt ? 'portkey-body' : ''])}>
        <div className="token-detail-title">
          <SettingHeader
            title={
              <div className="title">
                <p className="symbol">{currentToken?.symbol}</p>
                <p className="network">{transNetworkText(currentToken.chainId, isTestNet)}</p>
              </div>
            }
            leftCallBack={() => navigate('/')}
          />
        </div>
        <div className="token-detail-content">
          <div className="balance">
            <div className="balance-amount">
              <span className="amount">
                {formatAmountShow(divDecimals(currentToken.balance, currentToken.decimals || 8))} {currentToken.symbol}
              </span>
              {!isTestNet && (
                <span className="convert">
                  {amountInUsdShow(currentToken.balance, currentToken.decimals, currentToken.symbol)}
                </span>
              )}
            </div>
            <BalanceCard
              amount={currentToken?.balanceInUsd}
              isShowBuy={isShowBuy}
              onBuy={handleBuy}
              onSend={() => {
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
  }, [amountInUsdShow, currentToken, handleBuy, isPrompt, isShowBuy, isTestNet, navigate]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}

export default TokenDetail;
