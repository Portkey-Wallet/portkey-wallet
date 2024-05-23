import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import DepositCommonButton from './components/DepositCommonButton';
import { handleKeyDown } from 'utils/keyDown';
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
import { singleMessage } from '@portkey/did-ui-react';
import { handleErrorMessage } from '@portkey-wallet/utils';
import depositService from '@portkey-wallet/utils/deposit';

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
    fromNetwork,
    fromToken,
    toChainIdList,
    toChainId,
    toToken,
    unitReceiveAmount,
    // payAmount,
    receiveAmount,
    rateRefreshTime,
    isSameSymbol,
    setFrom,
    fetchDepositInfo,
    setPayAmount,
  } = useDeposit(initToToken, chain as ChainId, manager);
  console.log('wfs isSameSymbol===', isSameSymbol);
  const handleOnNext = useCallback(async () => {
    console.log('wfs click next!!');
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
  const onClickFrom = useCallback(async () => {
    try {
      setLoading(true);
      const networkList = await depositService.getNetworkList({
        chainId: toChainId || 'AELF',
      });
      const copiedNetworkList = [...networkList];
      if (copiedNetworkList && fromNetwork && copiedNetworkList[0].name !== fromNetwork.name) {
        copiedNetworkList.unshift(fromNetwork);
        copiedNetworkList.pop();
      }
      if (copiedNetworkList && fromNetwork && fromToken) {
        fromTokenNetworkRef.current = {
          networkList: copiedNetworkList.slice(0, 2),
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
      <div className="ext-nav-bar">
        <div className="frame-1">
          <div
            className="direction-left"
            onClick={() => {
              navigate('/');
            }}>
            <div className="union" />
          </div>
          <div className="frame-2">
            <span className="dev-mode">Deposit Assets</span>
          </div>
        </div>
        <div className="frame-3" />
      </div>
    );
  }, [navigate]);
  const renderCard = useMemo(() => {
    return (
      <div className="deposit-card-container">
        <div className="from-to-card-container">
          <div className="card-container">
            <div className="card-info-wrapper">
              <div className="dropdown-trigger">
                <span className="from-to-title">From</span>
                <div className="network-info-wrapper">
                  <NetworkLogo network={fromNetwork?.name} />
                  <span className="network-info-name">{fromNetwork?.name}</span>
                </div>
              </div>
            </div>
            <div className="token-wrapper" onClick={onClickFrom}>
              <div className="token-name-wrapper">
                <div className="token-icon-name">
                  <div className="token">
                    <img src={fromToken?.icon} className="token-img" />
                  </div>
                  <span className="token-name">{fromToken?.symbol}</span>
                </div>
                <CustomSvg type="DownDeposit" />
                {/* </div> */}
              </div>
              {!isSameSymbol && (
                <div className="token-amount-container">
                  <span className="token-amount-title">You Pay</span>
                  <input
                    type="number"
                    className="deposit-input"
                    placeholder="0.00"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      setPayAmount(Number(e.target.value));
                      console.log('onChange?.(e.target.value)', e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="card-container">
            <div className="card-info-wrapper">
              <div className="dropdown-trigger">
                <span className="from-to-title">To</span>
                <div className="network-info-wrapper">
                  <NetworkLogo network={'AELF'} />
                  <span className="network-info-name">
                    {toChainId === 'AELF' ? `MainChain ${toChainId}` : `SideChain ${toChainId}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="token-wrapper" onClick={onClickTo}>
              <div className="token-name-wrapper">
                <div className="token-icon-name">
                  <div className="token">
                    <img src={toToken?.icon} className="token-img" />
                  </div>
                  <span className="token-name">{toToken?.symbol}</span>
                </div>
                <CustomSvg type="DownDeposit" />
              </div>
              {!isSameSymbol && (
                <div className="token-amount-container">
                  <span className="token-amount-title">You Receive</span>
                  <input
                    value={receiveAmount.toAmount}
                    type="number"
                    className="deposit-input"
                    placeholder="0.00"
                    onKeyDown={handleKeyDown}
                    readOnly
                    onChange={(e) => {
                      console.log('onChange?.(e.target.value)', e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
            {!isSameSymbol && (
              <span className="mini-receive">Minimum receive: {receiveAmount.minimumReceiveAmount}</span>
            )}
          </div>
          <CustomSvg type="DepositTransfer" className="transfer-icon" />
        </div>
        {!isSameSymbol && (
          <ExchangeSimpleRate
            fromSymbol={fromToken?.symbol || ''}
            toSymbol={toToken?.symbol || ''}
            unitReceiveAmount={unitReceiveAmount}
            rateRefreshTime={rateRefreshTime}
            slippage={'0.05'}
            // onFetchNewRate={() => {
            //   console.log('onFetchNewRate!');
            // }}
          />
        )}
      </div>
    );
  }, [
    fromNetwork?.name,
    fromToken?.icon,
    fromToken?.symbol,
    isSameSymbol,
    onClickFrom,
    onClickTo,
    rateRefreshTime,
    receiveAmount.minimumReceiveAmount,
    receiveAmount.toAmount,
    setPayAmount,
    toChainId,
    toToken?.icon,
    toToken?.symbol,
    unitReceiveAmount,
  ]);
  const [step, setStep] = useState(Step.HOME);
  const homeEle = useMemo(() => {
    return (
      <div className="deposit-home-container">
        <div className="deposit-home-wrapper">
          {renderHeader}
          <div className="body">
            {renderCard}
            <DepositCommonButton text={'Next'} onClick={handleOnNext} />
          </div>
        </div>
      </div>
    );
  }, [handleOnNext, renderCard, renderHeader]);
  const mainContent = useCallback(() => {
    return (
      <>
        {step === Step.HOME && homeEle}
        {step === Step.FROM_NETWORK && (
          <SelectNetwork
            networkList={allNetworkListRef.current?.networkList || []}
            onClose={() => {
              setStep(Step.FROM_TOKEN);
            }}
            onClickItem={(network) => {
              if (
                fromTokenNetworkRef.current?.networkList &&
                fromTokenNetworkRef.current.networkList?.[0].name !== network.name
              ) {
                fromTokenNetworkRef.current.networkList.unshift(network);
                fromTokenNetworkRef.current.networkList.pop();
              }
              fromTokenNetworkRef.current = {
                fromNetwork: network,
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
            onMoreClicked={() => {
              setStep(Step.FROM_NETWORK);
            }}
            onItemClicked={(token) => {
              console.log('token', token);
              setFrom({ newFromNetwork: token.network!, newFromToken: token });
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
            }}
          />
        )}
        {step === Step.DEPOSIT_ADDRESS && (
          <DepositAddress
            depositInfo={depositAddressRef.current?.depositInfo}
            fromNetwork={depositAddressRef.current?.fromNetwork}
            fromToken={depositAddressRef.current?.fromToken}
            toToken={depositAddressRef.current?.toToken}
            onClose={() => {
              setStep(Step.HOME);
            }}
          />
        )}
      </>
    );
  }, [homeEle, setFrom, step, toChainId]);
  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
