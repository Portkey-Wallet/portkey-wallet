import MainCards from 'pages/components/BalanceCard';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import Activity from 'pages/Home/components/Activity';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useCommonState, useLoading } from 'store/Provider/hooks';
// import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/wallet';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useExtensionETransShow } from 'hooks/cms';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TReceiveLocationState, TSendLocationState, TTokenDetailLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { TradeTypeEnum } from 'constants/trade';
import { getDisclaimerData } from 'utils/disclaimer';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import CommonTokenHeader from 'components/CommonTokenHeader';
import { ReceiveTabEnum } from '@portkey-wallet/constants/constants-ca/send';
import SkeletonCom from 'pages/components/SkeletonCom';
import CommonBanner from 'components/CommonBanner';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import './index.less';

export enum TokenTransferStatus {
  CONFIRMED = 'Confirmed',
  SENDING = 'Sending',
}

export type TTokenDetailNavigateState = {
  tokenInfo: TTokenDetailLocationState;
};

function TokenDetail() {
  const navigate = useNavigateState<TTokenDetailNavigateState | Partial<TSendLocationState> | TReceiveLocationState>();
  const { state } = useLocationState<any>();
  const isMainNet = useIsMainnet();
  const { checkDappIsConfirmed } = useDisclaimer();
  const checkSecurity = useCheckSecurity();
  const { getTokenDetailBannerList } = useCmsBanner();
  const [tokenDetailBannerList, setTokenDetailBannerList] = useState<TBaseCardItemType[]>([]);
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const { awakenUrl = '' } = useCurrentNetworkInfo();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const { isRampShow } = useExtensionRampEntryShow();
  const { setLoading } = useLoading();

  const [currentChain, setCurrentChain] = useState(state.chainId);

  const currentToken = useMemo(() => {
    if (state?.tokenInfo.length == 1) {
      return state.tokenInfo[0];
    } else {
      return state.tokenInfo.filter((list: { chainId: string }) => list.chainId == currentChain)[0];
    }
  }, [state, currentChain]);

  useEffect(() => {
    const list = getTokenDetailBannerList(currentToken.chainId, currentToken.symbol);
    setTokenDetailBannerList(list);
  }, [currentToken.chainId, currentToken.symbol, getTokenDetailBannerList]);

  const cardShowFn = useMemo(
    () => checkEnabledFunctionalTypes(currentToken.symbol, currentToken.chainId === MAIN_CHAIN_ID),
    [currentToken.chainId, currentToken.symbol],
  );
  const isShowBuy = useMemo(() => cardShowFn.buy && isRampShow, [cardShowFn.buy, isRampShow]);
  const { isETransShow } = useExtensionETransShow();
  const isShowDeposit = useMemo(() => cardShowFn.deposit && isETransShow, [cardShowFn.deposit, isETransShow]);
  const defaultToken = useDefaultToken();
  const isShowFaucet = useMemo(
    () => !isMainNet && currentToken.symbol === defaultToken.symbol && currentToken.chainId === 'AELF',
    [currentToken.chainId, currentToken.symbol, defaultToken.symbol, isMainNet],
  );
  useFreshTokenPrice();
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const handleBuy = useCallback(() => {
    if (isMainNet) {
      navigate('/buy');
      // navigate(`/receive/token/${currentToken.symbol}`, {
      //   state: { ...currentToken, address: currentToken?.tokenContractAddress, pageSide: ReceiveTabEnum.Buy },
      // });
    } else {
      const openWinder = window.open(FAUCET_URL, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
    }
  }, [isMainNet, navigate]);
  const AmountShowWithDecimals = useMemo(
    () => formatTokenAmountShowWithDecimals(currentToken.balance, currentToken.decimals),
    [currentToken.balance, currentToken.decimals],
  );
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

      let originUrl = '';
      let targetUrl = '';
      switch (type) {
        case TradeTypeEnum.Swap:
          originUrl = awakenUrl;
          targetUrl = `${awakenUrl}/trading/EFL_USDT_0.05`;
          break;
      }
      if (checkDappIsConfirmed(originUrl)) {
        const openWinder = window.open(targetUrl, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
      } else {
        disclaimerData.current = getDisclaimerData({ type, originUrl, targetUrl });
        setDisclaimerOpen(true);
      }
    },
    [awakenUrl, checkDappIsConfirmed, handleCheckSecurity],
  );

  const handleSendOrReceive = useCallback(
    (type: 'send' | 'receive', pageSide?: ReceiveTabEnum) => {
      if (type === 'receive') {
        navigate('/receive-card', {
          state: { ...currentToken, address: currentToken?.tokenContractAddress, tokens: state.tokenInfo },
        });
        return;
      }
      navigate(`/${type}/token/${currentToken?.symbol}`, {
        state: { ...currentToken, address: currentToken?.tokenContractAddress, pageSide },
      });
    },
    [currentToken, navigate, state.tokenInfo],
  );

  useEffectOnce(() => {
    const app = document.getElementById('portkey-ui-root');
    if (!app) return;
    app.scrollTop = 0;
  });

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['token-detail'])}>
        <CommonTokenHeader
          symbol={currentToken.label ?? currentToken.symbol}
          imgUrl={currentToken.imageUrl}
          // chainId={currentToken.chainId}
        />

        <div className="token-detail-tabs">
          {state.tokenInfo.map((list: any) => {
            return (
              <div
                key={list.chainId}
                className={`${list.chainId == currentToken.chainId ? 'active' : 'token-detail-tab'}`}
                onClick={() => setCurrentChain(list.chainId)}>
                {list.displayChainName}
              </div>
            );
          })}
        </div>

        <div className={clsx('token-detail-content', isPrompt ? '' : 'token-detail-content-popup')}>
          <div className="token-detail-balance flex-column">
            <div className={clsx('balance-amount', 'flex-column', isPrompt && 'is-prompt')}>
              <div className={clsx('amount-number', AmountShowWithDecimals.length > 18 && 'amount-number-long')}>
                {AmountShowWithDecimals ?? <SkeletonCom />} {currentToken.label || currentToken.symbol}
              </div>
              <div className={clsx('amount-convert', !isMainNet && 'hidden-amount-convert')}>
                {formatAmountUSDShow(currentToken?.balanceInUsd) ?? <SkeletonCom />}
              </div>
            </div>
            <MainCards
              onBuy={isShowBuy ? handleBuy : undefined}
              onSend={cardShowFn.send ? () => handleSendOrReceive('send') : undefined}
              onReceive={cardShowFn.receive ? () => handleSendOrReceive('receive') : undefined}
              onClickSwap={cardShowFn.swap ? () => navigate('/swap') : undefined}
              onClickDeposit={isShowDeposit ? () => handleSendOrReceive('receive', ReceiveTabEnum.Deposit) : undefined}
              isShowFaucet={isShowFaucet}
            />
          </div>
          {!isNotLessThan768 && <CommonBanner wrapClassName="banner-wrap" bannerList={tokenDetailBannerList} />}
          <div className="token-detail-activity">
            <Activity chainId={currentToken.chainId} symbol={currentToken.symbol} pageKey="Token-Activity" />
          </div>
        </div>
      </div>
    );
  }, [
    isPrompt,
    isNotLessThan768,
    currentToken.label,
    currentToken.symbol,
    currentToken.imageUrl,
    currentToken?.balanceInUsd,
    currentToken.chainId,
    state.tokenInfo,
    AmountShowWithDecimals,
    isMainNet,
    isShowBuy,
    handleBuy,
    cardShowFn.send,
    cardShowFn.receive,
    cardShowFn.swap,
    isShowDeposit,
    isShowFaucet,
    tokenDetailBannerList,
    handleSendOrReceive,
    handleClickTrade,
  ]);

  return (
    <>
      {mainContent()}
      <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />
    </>
  );
}

export default TokenDetail;
