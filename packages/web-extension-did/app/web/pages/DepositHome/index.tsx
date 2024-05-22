import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import DepositCommonButton from './components/DepositCommonButton';
import { handleKeyDown } from 'utils/keyDown';
import ExchangeRate from './components/ExchangeRate';
import SelectNetwork from './components/SelectNetwork';
import TokenNetworkList from './components/TokenNetworkList';
import DepositAddress from './components/DepositAddress';
import { useDeposit } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import NetworkLogo from './components/NetworkLogo';
import { getImageUrlBySymbol } from 'utils';
import { TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import getSeed from 'utils/getSeed';
import { getWallet } from '@portkey-wallet/utils/aelf';

enum Step {
  HOME,
  FROM_TOKEN,
  FROM_NETWORK,
  TO_TOKEN,
  DEPOSIT_ADDRESS,
}
export default function DepositHome() {
  const { chain, symbol } = useParams();
  console.log('chain', chain, 'symbol', symbol);
  const initToToken: TTokenItem = {
    name: '',
    symbol: symbol || '',
    icon: getImageUrlBySymbol(symbol),
  };
  const [manager, setManager] = useState();
  useEffect(() => {
    const fetch = async () => {
      const { privateKey } = await getSeed();
      console.log('wfs useEffect', privateKey);
      if (!privateKey) throw 'Invalid user information, please check';
      const manager = getWallet(privateKey);
      setManager(manager);
    };
    fetch();
  }, []);
  const {
    fromNetwork,
    fromToken,
    toChainIdList,
    toChainId,
    toToken,
    unitReceiveAmount,
    payAmount,
    receiveAmount,
    fetchDepositInfo,
    setPayAmount,
  } = useDeposit(initToToken, chain as ChainId, manager);
  console.log('wfs fromNetwork', fromNetwork);
  console.log('wfs fromToken', fromToken);
  console.log('wfs toChainId', toChainId);
  console.log('wfs toToken', toToken);
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();

  const [youReceive, setReceive] = useState<number | undefined>(undefined);
  useEffect(() => {
    setTimeout(() => {
      setReceive(305.627);
      console.log('setReceive');
    }, 5000);
  }, [setReceive]);
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
            <div className="token-wrapper">
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
              <div className="token-amount-container">
                <span className="token-amount-title">You Pay</span>
                <input
                  type="number"
                  className="deposit-input"
                  placeholder="0.00"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    console.log('onChange?.(e.target.value)', e.target.value);
                  }}
                />
              </div>
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
            <div className="token-wrapper">
              <div className="token-name-wrapper">
                <div className="token-icon-name">
                  <div className="token">
                    <img src={toToken?.icon} className="token-img" />
                  </div>
                  <span className="token-name">{toToken?.symbol}</span>
                </div>
                <CustomSvg type="DownDeposit" />
              </div>
              <div className="token-amount-container">
                <span className="token-amount-title">You Receive</span>
                <input
                  value={youReceive}
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
            </div>
            <span className="mini-receive">Minimum receive: 105.12345678</span>
          </div>
          <CustomSvg type="DepositTransfer" className="transfer-icon" />
        </div>
        <ExchangeRate
          fromSymbol={fromToken?.symbol || ''}
          toSymbol={toToken?.symbol || ''}
          toChainId={toChainId || 'AELF'}
          slippage={'0.05'}
          onFetchNewRate={() => {
            console.log('onFetchNewRate!');
          }}
        />
      </div>
    );
  }, [fromNetwork?.name, fromToken?.icon, fromToken?.symbol, toChainId, toToken?.icon, toToken?.symbol, youReceive]);
  const [step, setStep] = useState(Step.HOME);
  const homeEle = useMemo(() => {
    return (
      <div className="deposit-home-container">
        <div className="deposit-home-wrapper">
          {renderHeader}
          <div className="body">
            {renderCard}
            <DepositCommonButton
              text={'Next'}
              onClick={() => {
                console.log('clicked next!!');
                setStep(Step.FROM_TOKEN);
              }}
            />
          </div>
        </div>
      </div>
    );
  }, [renderCard, renderHeader]);
  const mainContent = useCallback(() => {
    return (
      <>
        {step === Step.HOME && homeEle}
        {step === Step.FROM_NETWORK && (
          <SelectNetwork
            onClose={() => {
              setStep(Step.HOME);
            }}
          />
        )}
        {step === Step.FROM_TOKEN && (
          <TokenNetworkList
            drawerType={'from'}
            onClose={() => {
              setStep(Step.HOME);
            }}
          />
        )}
        {step === Step.TO_TOKEN && (
          <TokenNetworkList
            drawerType={'to'}
            onClose={() => {
              setStep(Step.HOME);
            }}
          />
        )}
        {step === Step.DEPOSIT_ADDRESS && (
          <DepositAddress
            onClose={() => {
              setStep(Step.HOME);
            }}
          />
        )}
      </>
    );
  }, [homeEle, step]);
  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
