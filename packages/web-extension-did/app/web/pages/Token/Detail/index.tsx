import MainCards from 'pages/components/BalanceCard';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/wallet';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useExtensionETransShow } from 'hooks/cms';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import './index.less';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TSendLocationState, TTokenDetailLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { SHOW_RAMP_CHAIN_ID_LIST, SHOW_RAMP_SYMBOL_LIST } from '@portkey-wallet/constants/constants-ca/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import CustomSvg from 'components/CustomSvg';
import { TradeTypeEnum } from 'constants/trade';
import { getDisclaimerData } from 'utils/disclaimer';

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
  // TODO
  const isShowSwap = true;
  const { isETransShow } = useExtensionETransShow();
  const isShowDeposit = useMemo(
    () => currentToken.symbol === 'USDT' && isETransShow,
    [currentToken.symbol, isETransShow],
  );
  const defaultToken = useDefaultToken();
  const isShowFaucet = useMemo(
    () => !isMainNet && currentToken.symbol === defaultToken.symbol && currentToken.chainId === 'AELF',
    [currentToken.chainId, currentToken.symbol, defaultToken.symbol, isMainNet],
  );
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

  const handleCheckSecurity = useCallback(async () => {
    try {
      setLoading(true);
      const isSafe = await checkSecurity(currentToken.chainId);
      setLoading(false);
      return isSafe;
    } catch (error) {
      setLoading(false);
      console.log('===handleCheckSecurity error', error);
      return false;
    }
  }, [checkSecurity, currentToken.chainId, setLoading]);

  const handleClickTrade = useCallback(
    async (type: TradeTypeEnum) => {
      const isSecurity = await handleCheckSecurity();
      if (!isSecurity) return;

      let tradeLink = '';
      switch (type) {
        case TradeTypeEnum.Swap:
          tradeLink = '';
          break;
        case TradeTypeEnum.ETrans:
          tradeLink = stringifyETrans({
            url: eTransferUrl || '',
            query: {
              tokenSymbol: currentToken.symbol,
              chainId: currentToken.chainId,
            },
          });
          break;
      }
      if (checkDappIsConfirmed(tradeLink)) {
        const openWinder = window.open(tradeLink, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
      } else {
        disclaimerData.current = getDisclaimerData(tradeLink, type);
        setDisclaimerOpen(true);
      }
    },
    [checkDappIsConfirmed, currentToken.chainId, currentToken.symbol, eTransferUrl, handleCheckSecurity],
  );

  useEffectOnce(() => {
    const app = document.getElementById('portkey-ui-root');
    if (!app) return;
    app.scrollTop = 0;
  });

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['token-detail', isPrompt ? 'portkey-body' : ''])}>
        <div className="token-detail-title flex">
          <CustomSvg type="NewRightArrow" onClick={() => navigate('/')} />
          <div className="title-center flex-column">
            <div className="symbol flex-row-center">
              <TokenImageDisplay symbol={currentToken.symbol} src={currentToken.imgUrl} width={20} />
              <span>{currentToken?.symbol}</span>
            </div>
            <div className="network">{transNetworkText(currentToken.chainId, !isMainNet)}</div>
          </div>
        </div>
        <div className={clsx('token-detail-content', isPrompt ? '' : 'token-detail-content-popup')}>
          <div className="token-detail-balance flex-column">
            <div className={clsx('balance-amount', 'flex-column', isPrompt && 'is-prompt')}>
              <div className="amount-number">
                {formatTokenAmountShowWithDecimals(currentToken.balance, currentToken.decimals)}
              </div>
              <div className={clsx('amount-convert', !isMainNet && 'hidden-amount-convert')}>
                {formatAmountUSDShow(currentToken?.balanceInUsd)}
              </div>
            </div>
            <MainCards
              onBuy={isShowBuy ? handleBuy : undefined}
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
              onClickSwap={isShowSwap ? () => handleClickTrade(TradeTypeEnum.Swap) : undefined}
              onClickDeposit={isShowDeposit ? () => handleClickTrade(TradeTypeEnum.ETrans) : undefined}
              isShowFaucet={isShowFaucet}
            />
          </div>
          <div className="token-detail-activity">
            <div className="token-detail-activity-title">Activity</div>
            <Activity chainId={currentToken.chainId} symbol={currentToken.symbol} />
          </div>
        </div>
      </div>
    );
  }, [
    isPrompt,
    currentToken,
    isMainNet,
    isShowBuy,
    handleBuy,
    isShowSwap,
    isShowDeposit,
    isShowFaucet,
    navigate,
    handleClickTrade,
  ]);

  return (
    <>
      {isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}
      <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />
    </>
  );
}

export default TokenDetail;
