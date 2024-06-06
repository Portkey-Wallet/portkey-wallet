import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import DepositCommonButton from './components/DepositCommonButton';
// import { handleKeyDown } from 'utils/keyDown';
// import ExchangeRate from './components/ExchangeRate';
import ExchangeSimpleRate from './components/ExchangeSimpleRate';
import SelectNetwork from './components/SelectNetwork';
import TokenNetworkList from './components/TokenNetworkList';
import DepositAddress from './components/DepositAddress';
import { useDeposit } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import NetworkLogo from './components/NetworkLogo';
import { getImageUrlBySymbol } from 'utils';
import { TDepositInfo, TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import getSeed from 'utils/getSeed';
import { getWallet } from '@portkey-wallet/utils/aelf';
import { useLoading } from 'store/Provider/hooks';
import { isValidNumber, singleMessage } from '@portkey/did-ui-react';
import { FormatNameRuleList, formatNameWithRules, handleErrorMessage } from '@portkey-wallet/utils';
import depositService from '@portkey-wallet/utils/deposit';
import CommonHeader from 'components/CommonHeader';
import clsx from 'clsx';

enum Step {
  HOME,
  FROM_TOKEN,
  FROM_NETWORK,
  TO_TOKEN,
  DEPOSIT_ADDRESS,
}
export default function DepositHome() {
  const { chain, symbol } = useParams();
  const initToToken: TTokenItem = {
    name: '',
    symbol: symbol || '',
    icon: getImageUrlBySymbol(symbol),
  };
  const [manager, setManager] = useState();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const depositAddressRef = useRef<{
    depositInfo: TDepositInfo;
    fromNetwork: TNetworkItem | undefined;
    fromToken: TTokenItem | undefined;
    toToken: TTokenItem | undefined;
  }>();
  const fromTokenNetworkRef = useRef<{
    networkList: TNetworkItem[];
    allNetworkList: TNetworkItem[];
    fromNetwork: TNetworkItem | undefined;
    fromToken: TTokenItem | undefined;
    networkListSize: number;
    toChainId: ChainId;
  }>();
  const toTokenNetworkRef = useRef<{
    toChainIdList: ChainId[];
    toChainId: ChainId | undefined;
    toToken: TTokenItem | undefined;
  }>();
  const allNetworkListRef = useRef<{
    networkList: TNetworkItem[];
  }>();
  useEffect(() => {
    (async () => {
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'Invalid user information, please check';
      const manager = getWallet(privateKey);
      setManager(manager);
    })();
  }, []);
  const {
    loading,
    fromNetwork,
    fromToken,
    toChainIdList,
    toChainId,
    toToken,
    unitReceiveAmount,
    payAmount,
    receiveAmount,
    rateRefreshTime,
    isSameSymbol,
    setFrom,
    setTo,
    fetchDepositInfo,
    setPayAmount,
  } = useDeposit(initToToken, chain as ChainId, manager);
  console.log('wfs isSameSymbol===', isSameSymbol);
  console.log('wfs receiveAmount->toAmount===', receiveAmount.toAmount);
  console.log('wfs payAmount===', payAmount);
  useEffect(() => {
    if (loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loading, setLoading]);
  const handleOnNext = useCallback(async () => {
    try {
      setLoading(true);
      const depositInfo = await fetchDepositInfo();
      if (depositInfo && fromNetwork && fromToken && toToken) {
        depositAddressRef.current = {
          depositInfo,
          fromNetwork,
          fromToken,
          toToken,
        };
        setStep(Step.DEPOSIT_ADDRESS);
      }
    } catch (error) {
      console.log('aaaa error : ', error);
      singleMessage.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [fetchDepositInfo, fromNetwork, fromToken, setLoading, toToken]);
  const resetTwoNetworkList = useCallback(
    (networkList: TNetworkItem[]) => {
      let copiedNetworkList = [...networkList];
      if (copiedNetworkList && fromNetwork && copiedNetworkList[0].network !== fromNetwork.network) {
        copiedNetworkList = copiedNetworkList.filter((item) => item.network !== fromNetwork.network);
        copiedNetworkList.unshift(fromNetwork);
        // copiedNetworkList.pop();
      }
      return copiedNetworkList.slice(0, 2);
    },
    [fromNetwork],
  );
  const onClickFrom = useCallback(async () => {
    try {
      setLoading(true);
      const networkList = await depositService.getNetworkList({
        chainId: toChainId || 'AELF',
      });
      let copiedNetworkList = [...networkList];
      if (copiedNetworkList && fromNetwork && copiedNetworkList[0].network !== fromNetwork.network) {
        copiedNetworkList = copiedNetworkList.filter((item) => item.network !== fromNetwork.network);
        copiedNetworkList.unshift(fromNetwork);
        // copiedNetworkList.pop();
      }
      if (copiedNetworkList && fromNetwork && fromToken) {
        fromTokenNetworkRef.current = {
          networkList: copiedNetworkList.slice(0, 2),
          allNetworkList: networkList,
          fromNetwork,
          fromToken,
          networkListSize: networkList.length,
          toChainId: toChainId || 'AELF',
        };
        allNetworkListRef.current = {
          networkList,
        };
        setStep(Step.FROM_TOKEN);
      } else {
        throw 'invalid params';
      }
    } catch (error) {
      console.log('aaaa error : ', error);
      singleMessage.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [setLoading, toChainId, fromNetwork, fromToken]);
  const onClickTo = useCallback(async () => {
    try {
      setLoading(true);

      if (toChainIdList && toChainId && toToken) {
        toTokenNetworkRef.current = {
          toChainIdList,
          toChainId,
          toToken,
        };
        setStep(Step.TO_TOKEN);
      } else {
        throw 'invalid params';
      }
    } catch (error) {
      console.log('aaaa error : ', error);
      singleMessage.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [setLoading, toChainIdList, toChainId, toToken]);
  const renderHeader = useMemo(() => {
    return (
      <CommonHeader
        title={'Deposit Asset'}
        onLeftBack={() => {
          navigate('/');
        }}
      />
    );
  }, [navigate]);
  const renderCard = useMemo(() => {
    return (
      <div className="deposit-card-container">
        <div className="from-to-card-container">
          <div className="card-container">
            <div className="card-info-wrapper">
              {fromNetwork && (
                <div className="dropdown-trigger" onClick={onClickFrom}>
                  <span className="from-to-title">From</span>
                  <div className="network-info-wrapper">
                    <NetworkLogo network={fromNetwork?.network} />
                    <span className="network-info-name">{fromNetwork?.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="token-wrapper">
              {fromToken && (
                <div className="token-name-wrapper" onClick={onClickFrom}>
                  <div className="token-icon-name">
                    <div className="token">
                      <img src={fromToken?.icon} className="token-img" />
                    </div>
                    <span className="token-name">
                      {formatNameWithRules(fromToken?.symbol || '', [FormatNameRuleList.NO_UNDERLINE])}
                    </span>
                  </div>
                  <CustomSvg type="DownDeposit" />
                  {/* </div> */}
                </div>
              )}
              {!isSameSymbol && (
                <div className="token-amount-container">
                  <span className="token-amount-title">You Pay</span>
                  <input
                    value={payAmount === 0 ? '' : payAmount}
                    type="text"
                    className="deposit-input"
                    placeholder="0.00"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      console.log('wfs payAmount onChange===', e.target.value);
                      if (!isValidNumber(e.target.value)) {
                        setPayAmount(0);
                      } else {
                        const localPayAmount = e.target.value ? Number(e.target.value) : 0;
                        setPayAmount(localPayAmount);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="card-container">
            <div className="card-info-wrapper">
              {toChainId && (
                <div className="dropdown-trigger" onClick={onClickTo}>
                  <span className="from-to-title">To</span>
                  <div className="network-info-wrapper">
                    <NetworkLogo network={'AELF'} />
                    <span className="network-info-name">
                      {toChainId === 'AELF' ? `MainChain ${toChainId}` : `SideChain ${toChainId}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="token-wrapper">
              {toToken && (
                <div className="token-name-wrapper" onClick={onClickTo}>
                  <div className="token-icon-name">
                    <div className="token">
                      <img src={toToken?.icon} className="token-img" />
                    </div>
                    <span className="token-name">
                      {formatNameWithRules(toToken?.symbol || '', [FormatNameRuleList.NO_UNDERLINE])}
                    </span>
                  </div>
                  <CustomSvg type="DownDeposit" />
                </div>
              )}
              {!isSameSymbol && (
                <div className="token-amount-container">
                  <span className="token-amount-title">You Receive</span>
                  <span className={clsx(['deposit-input', receiveAmount.toAmount === 0 && 'receive-zero'])}>
                    {payAmount > 0 ? (receiveAmount.toAmount === 0 ? '0.00' : receiveAmount.toAmount) : '0.00'}
                  </span>
                </div>
              )}
            </div>
            {!isSameSymbol && payAmount > 0 && receiveAmount.minimumReceiveAmount > 0 && (
              <span className="mini-receive">Minimum receive: {receiveAmount.minimumReceiveAmount}</span>
            )}
          </div>
          <CustomSvg type="DepositTransfer" className="transfer-icon" />
        </div>
        {!isSameSymbol && (
          <ExchangeSimpleRate
            fromSymbol={fromToken?.symbol || ''}
            toSymbol={formatNameWithRules(toToken?.symbol || '', [FormatNameRuleList.NO_UNDERLINE])}
            unitReceiveAmount={unitReceiveAmount}
            rateRefreshTime={rateRefreshTime}
            slippage={'0.05'}
          />
        )}
      </div>
    );
  }, [
    fromNetwork,
    fromToken,
    isSameSymbol,
    onClickFrom,
    onClickTo,
    payAmount,
    rateRefreshTime,
    receiveAmount.minimumReceiveAmount,
    receiveAmount.toAmount,
    setPayAmount,
    toChainId,
    toToken,
    unitReceiveAmount,
  ]);
  const [step, setStep] = useState(Step.HOME);
  const homeEle = useMemo(() => {
    return (
      <div className={clsx(['deposit-home-container', isPrompt && 'detail-page-prompt'])}>
        <div className="deposit-home-wrapper">
          {renderHeader}
          <div className="body">
            {renderCard}
            <DepositCommonButton text={'Next'} onClick={handleOnNext} />
          </div>
        </div>
      </div>
    );
  }, [handleOnNext, isPrompt, renderCard, renderHeader]);
  const mainContent = useCallback(() => {
    return (
      <>
        {step === Step.HOME && homeEle}
        {step === Step.FROM_NETWORK && (
          <SelectNetwork
            networkList={allNetworkListRef.current?.networkList || []}
            fromTokenSymbol={formatNameWithRules(fromToken?.symbol || '', [FormatNameRuleList.NO_UNDERLINE])}
            onClose={() => {
              setStep(Step.FROM_TOKEN);
            }}
            onClickItem={(network) => {
              if (
                fromTokenNetworkRef.current?.networkList &&
                fromTokenNetworkRef.current.networkList?.[0].network !== network.network
              ) {
                if (network.network === fromNetwork?.network) {
                  // selected network is fromNetwork, reset to init state
                  fromTokenNetworkRef.current.networkList = resetTwoNetworkList(
                    fromTokenNetworkRef.current.allNetworkList,
                  );
                } else {
                  // selected network is not fromNetwork, and networkList the first network is not equals fromNetwork
                  if (fromTokenNetworkRef.current.networkList?.[0].network !== fromNetwork?.network) {
                    fromTokenNetworkRef.current.networkList[0] = network;
                  } else {
                    // selected network is not fromNetwork, and networkList the first network is equals fromNetwork
                    fromTokenNetworkRef.current.networkList.unshift(network);
                    fromTokenNetworkRef.current.networkList.pop();
                  }
                }
              }
              fromTokenNetworkRef.current = {
                fromNetwork: network,
                allNetworkList: fromTokenNetworkRef.current?.allNetworkList || [],
                networkList: fromTokenNetworkRef.current?.networkList || [],
                fromToken: fromTokenNetworkRef.current?.fromToken,
                networkListSize: fromTokenNetworkRef.current?.networkListSize || 0,
                toChainId: toChainId || 'AELF',
              };
              setStep(Step.FROM_TOKEN);
            }}
          />
        )}
        {step === Step.FROM_TOKEN && (
          <TokenNetworkList
            networkList={fromTokenNetworkRef.current?.networkList || []}
            network={fromTokenNetworkRef.current?.fromNetwork}
            token={fromTokenNetworkRef.current?.fromToken}
            networkListSize={fromTokenNetworkRef.current?.networkListSize}
            toChainId={fromTokenNetworkRef.current?.toChainId}
            drawerType={'from'}
            onClose={() => {
              setStep(Step.HOME);
            }}
            onMoreClicked={(index) => {
              // save from-TokenNetworkList component selected state
              const selectedNetwork = fromTokenNetworkRef.current?.networkList[index - 1];
              fromTokenNetworkRef.current = {
                fromNetwork: selectedNetwork,
                networkList: fromTokenNetworkRef.current?.networkList || [],
                allNetworkList: fromTokenNetworkRef.current?.allNetworkList || [],
                fromToken: fromTokenNetworkRef.current?.fromToken,
                networkListSize: fromTokenNetworkRef.current?.networkListSize || 0,
                toChainId: toChainId || 'AELF',
              };
              setStep(Step.FROM_NETWORK);
            }}
            onItemClicked={(token) => {
              console.log('token', token);
              setFrom({ newFromNetwork: token.network!, newFromToken: token });
              setStep(Step.HOME);
            }}
          />
        )}
        {step === Step.TO_TOKEN && (
          <TokenNetworkList
            toChainIdList={toTokenNetworkRef.current?.toChainIdList || []}
            toChainId={toTokenNetworkRef.current?.toChainId}
            token={toTokenNetworkRef.current?.toToken}
            drawerType={'to'}
            onClose={() => {
              setStep(Step.HOME);
            }}
            onItemClicked={(token) => {
              console.log('token', token);
              setTo({
                newToChainId: token.network?.network as ChainId,
                newToToken: token,
              });
              setStep(Step.HOME);
            }}
          />
        )}
        {step === Step.DEPOSIT_ADDRESS && (
          <DepositAddress
            depositInfo={depositAddressRef.current?.depositInfo}
            fromNetwork={depositAddressRef.current?.fromNetwork}
            fromToken={depositAddressRef.current?.fromToken}
            toToken={depositAddressRef.current?.toToken}
            isSameSymbol={isSameSymbol}
            onClose={() => {
              setStep(Step.HOME);
            }}
          />
        )}
      </>
    );
  }, [
    fromNetwork?.network,
    fromToken?.symbol,
    homeEle,
    isSameSymbol,
    resetTwoNetworkList,
    setFrom,
    setTo,
    step,
    toChainId,
  ]);
  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
