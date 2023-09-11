import { useLocation, useNavigate } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import BalanceCard from 'pages/components/BalanceCard';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice, useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/payment';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';
import { useBuyButtonShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { useCheckSecurity } from 'hooks/useSecurity';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

function TokenDetail() {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { state: currentToken } = useLocation();
  const isMainNet = useIsMainnet();
  const { isPrompt } = useCommonState();
  const { isBuyButtonShow } = useBuyButtonShow(VersionDeviceType.Extension);
  const isShowBuy = useMemo(
    () => currentToken.symbol === 'ELF' && currentToken.chainId === 'AELF' && isBuyButtonShow,
    [currentToken.chainId, currentToken.symbol, isBuyButtonShow],
  );
  const amountInUsdShow = useAmountInUsdShow();
  useFreshTokenPrice();
  const checkSecurity = useCheckSecurity();

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
              isShowBuy={isShowBuy}
              onBuy={handleBuy}
              onSend={async () => {
                try {
                  setLoading(true);
                  const res = await checkSecurity();
                  setLoading(false);
                  if (typeof res === 'boolean') {
                    navigate(`/send/token/${currentToken?.symbol}`, {
                      state: { ...currentToken, address: currentToken?.tokenContractAddress },
                    });
                  }
                } catch (error) {
                  setLoading(false);

                  const msg = handleErrorMessage(error);
                  message.error(msg);
                }
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
  }, [isPrompt, currentToken, isMainNet, amountInUsdShow, isShowBuy, handleBuy, navigate, setLoading, checkSecurity]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}

export default TokenDetail;
