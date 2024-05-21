import { useCallback, useMemo } from 'react';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { List } from 'antd';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
export interface ISelectNetworkProps {
  onClose?: () => void;
  type?: 'component' | 'page';
}
export default function SelectNetwork(props: ISelectNetworkProps) {
  // const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const { type = 'component', onClose } = props || {};
  const renderNotice = useMemo(() => {
    return (
      <div className="notice-container">
        <CustomSvg type="Info" />
        <span className="note-text">
          Note: Please select from the supported networks listed below. Sending USDT from other networks may result in
          the loss of your assets.
        </span>
      </div>
    );
  }, []);
  const data = useMemo(
    () => [
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'Ethereum (ERC20)',
        arrivalTime: '21mins',
        confirmations: '64 Confirmations',
      },
      {
        img: 'img',
        text: 'WEthereum (ERC20)',
        arrivalTime: '121mins',
        confirmations: '64 Confirmations',
      },
    ],
    [],
  );
  const renderList = useMemo(() => {
    return (
      <List
        className="network-list"
        // itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            className="select-network-list-item"
            onClick={() => {
              console.log('click item', item);
            }}>
            <List.Item.Meta
              className="select-network-list-item-meta"
              avatar={<div className={item.img} />}
              title={<span className="network-name">{item.text}</span>}
              description={
                <div className="item-wrapper-text">
                  <span className="arrive-time">{`Arrival Time ≈ ${item.arrivalTime}`}</span>
                  <span className="confirm-times">{item.confirmations}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  }, [data]);
  const mainContent = useCallback(() => {
    return (
      <div className="deposit-select-network-container">
        <div className="group">
          <div className="wrapper">
            <CustomSvg
              type="LeftArrow"
              onClick={() => {
                onClose?.();
              }}
            />
            <div className="box">
              <span className="text">Select Network</span>
            </div>
          </div>
          <div className="section-2" />
        </div>
        <div className="body">
          {renderNotice}
          {renderList}
        </div>
      </div>
    );
  }, [onClose, renderList, renderNotice]);
  return <>{isPrompt && type === 'page' ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
