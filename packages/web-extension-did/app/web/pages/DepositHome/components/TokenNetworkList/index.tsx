import { useCallback, useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { List } from 'antd';
import usdt from '../assets/images/568656dc-ca4b-464f-b6df-6dcb3c406882.png';
import bnb from '../assets/images/7d827072-15c9-4769-8067-a1be933bc2c3.png';
import eth from '../assets/images/70b5df10-71d4-4f3c-b872-9f1ccaafca92.png';
import NetworkLogo from '../NetworkLogo';
import { BlockchainNetworkType } from 'constants/network';

export interface ITokenNetworkListProps {
  onChange?: (item: any) => void;
  onClose?: () => void;
  drawerType: 'from' | 'to';
  type?: 'component' | 'page';
}
const tokens = [
  {
    name: 'USDT',
    fullName: 'Tether USD',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: usdt,
  },
  {
    name: 'BNB',
    fullName: 'Binance Coin',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: bnb,
  },
  {
    name: 'ETH',
    fullName: 'Ethereum',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: eth,
  },
  {
    name: 'USDT',
    fullName: 'Tether USD',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: usdt,
  },
  {
    name: 'BNB',
    fullName: 'Binance Coin',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: bnb,
  },
  {
    name: 'ETH',
    fullName: 'Ethereum',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: eth,
  },
  {
    name: 'USDT',
    fullName: 'Tether USD',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: usdt,
  },
  {
    name: 'BNB',
    fullName: 'Binance Coin',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: bnb,
  },
  {
    name: 'SETH',
    fullName: 'SEthereum',
    address: '0xh7jl...zh74x6',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: eth,
  },
];
export default function TokenNetworkList(pros: ITokenNetworkListProps) {
  console.log(pros);
  const { drawerType, type = 'component', onClose } = pros;
  // const { state } = useLocationState<ITokenNetworkListProps>();
  const headerTitle = useMemo(
    () => (drawerType === 'from' ? 'Select Pay Token' : 'Select Receive Token'),
    [drawerType],
  );
  const { isPrompt } = useCommonState();
  console.log('isPrompt====', isPrompt);
  const headerEle = useMemo(() => {
    return (
      <div className="ext-nav-bar">
        <span className="dev-mode">{headerTitle}</span>
        <div
          className="suggest-close"
          onClick={() => {
            onClose?.();
          }}>
          <div className="union" />
        </div>
      </div>
    );
  }, [headerTitle, onClose]);
  const selectNetworkEle = useMemo(() => {
    return (
      <div className="select-network-container">
        <span className="select-network">Select Network</span>
        <div className="all">
          <button className="all-button network-button network-button-unselected">
            <span className="all-span">All</span>
          </button>
          <button className="network-1-button network-button network-button-selected">
            <CustomSvg type="Binance" />
            <span className="network-1-name">BNB Smart Chain</span>
          </button>
          <button className="network-2-button network-button network-button-unselected">
            <CustomSvg type="Ethereum" />
            <span className="network-2-name">Ethereum</span>
          </button>
          <button className="network-more-button network-button network-button-unselected">
            <span className="network-more-count">6+</span>
          </button>
        </div>
      </div>
    );
  }, []);
  const selectTokenEle = useMemo(() => {
    return (
      <div className="select-token-container">
        <div className="select-token-title">
          <span className="select-token">Select Token</span>
        </div>
        <List
          className="token-list"
          dataSource={tokens}
          renderItem={(token) => (
            <List.Item
              onClick={() => {
                console.log('click item!!', token);
              }}>
              <div className="item-container">
                <div className="item-wrapper">
                  <div className="icon-wrapper">
                    <img src={token.icon} alt="TokenSymbol" width="36" height="36" />
                    <div className="network-icon-container">
                      <NetworkLogo network={BlockchainNetworkType.AELF} />
                    </div>
                  </div>
                  <div className="token-info-container">
                    <div className="token-info-name-container">
                      <span className="token-name">{token.name}</span>
                      <span className="token-full-name">{token.fullName}</span>
                    </div>
                    <span className="token-address">{token.address}</span>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }, []);
  const mainContent = useCallback(() => {
    return (
      <div className="select-token-network-list">
        {headerEle}
        <div className="body">
          {selectNetworkEle}
          {selectTokenEle}
        </div>
      </div>
    );
  }, [headerEle, selectNetworkEle, selectTokenEle]);
  return <>{isPrompt && type === 'page' ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
