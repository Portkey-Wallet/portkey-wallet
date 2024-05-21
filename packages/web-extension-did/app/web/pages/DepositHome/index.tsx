import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import DepositCommonButton from './components/DepositCommonButton';
import { handleKeyDown } from 'utils/keyDown';
import Calculator from './components/Calculator';
import SelectNetwork from './components/SelectNetwork';
import TokenNetworkList from './components/TokenNetworkList';
import DepositAddress from './components/DepositAddress';
enum Step {
  HOME,
  FROM_TOKEN,
  FROM_NETWORK,
  TO_TOKEN,
  DEPOSIT_ADDRESS,
}
export default function DepositHome() {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const [showRateText, setShowRateText] = useState('1 USDT ≈ 1.12345678 SGR');
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [updateTime, setUpdateTime] = useState(15);
  const fetchNewRateText = useCallback(async () => {
    try {
      setIsFetchingRate(true);
      const response = await fetch('https://api.example.com/rate');
      const data = await response.json();
      setShowRateText(`1 USDT ≈ ${data.rate} SGR`);
    } catch (e) {
      setShowRateText(`1 USDT ≈ 2 SGR`);
      setUpdateTime(15);
    } finally {
      setIsFetchingRate(false);
    }
  }, []);
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (!isFetchingRate) {
      timer = setInterval(() => {
        setUpdateTime((prev) => {
          if (prev - 1 <= 0) {
            fetchNewRateText();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [setUpdateTime, isFetchingRate, fetchNewRateText]);

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
                  <div className="icons-network" />
                  <span className="network-info-name">BNB Smart Chain</span>
                </div>
              </div>
            </div>
            <div className="token-wrapper">
              <div className="token-name-wrapper">
                <div className="token-icon-name">
                  <div className="token">
                    <img src="https://cdn.worldvectorlogo.com/logos/bitcoin.svg" className="token-img" />
                  </div>
                  <span className="token-name">USDT</span>
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
              <span className="from-to-title">To</span>
              <div className="network-info-wrapper">
                <div className="icons-network-16" />
                <span className="network-info-name">SideChain tDVV</span>
              </div>
            </div>
            <div className="token-wrapper">
              <div className="token-name-wrapper">
                <div className="token-icon-name">
                  <div className="token">
                    <img src="https://cdn.worldvectorlogo.com/logos/bitcoin.svg" className="token-img" />
                  </div>
                  <span className="token-name">SGR</span>
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
                <span className="mini-receive">Minimum receive: 105.12345678</span>
              </div>
            </div>
          </div>
          <CustomSvg type="DepositTransfer" className="transfer-icon" />
        </div>
        <Calculator showRateText={showRateText} updateTime={updateTime} />
      </div>
    );
  }, [showRateText, updateTime, youReceive]);
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
                setStep(Step.DEPOSIT_ADDRESS);
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
