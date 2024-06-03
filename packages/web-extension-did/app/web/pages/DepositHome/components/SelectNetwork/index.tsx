import { useCallback, useMemo } from 'react';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { List } from 'antd';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { TNetworkItem } from '@portkey-wallet/types/types-ca/deposit';
import NetworkLogo from '../NetworkLogo';
import CommonHeader from 'components/CommonHeader';
import clsx from 'clsx';
export interface ISelectNetworkProps {
  onClose?: () => void;
  onClickItem?: (network: TNetworkItem) => void;
  networkList?: TNetworkItem[];
  fromTokenSymbol?: string;
  type?: 'component' | 'page';
}
export default function SelectNetwork(props: ISelectNetworkProps) {
  const { isPrompt } = useCommonState();
  const { type = 'component', networkList, fromTokenSymbol, onClickItem, onClose } = props || {};
  console.log('wfs fromTokenSymbol===', fromTokenSymbol);
  const renderNotice = useMemo(() => {
    return (
      <div className="notice-container">
        <CustomSvg type="Info" />
        <span className="note-text">
          Note: Please select from the supported networks listed below. Sending {fromTokenSymbol || 'USDT'} from other
          networks may result in the loss of your assets.
        </span>
      </div>
    );
  }, [fromTokenSymbol]);

  const renderList = useMemo(() => {
    return (
      <List
        className="network-list flex-1"
        // itemLayout="horizontal"
        dataSource={networkList}
        renderItem={(item) => (
          <List.Item
            className="select-network-list-item"
            onClick={() => {
              onClickItem?.(item);
            }}>
            <List.Item.Meta
              className="select-network-list-item-meta"
              avatar={<NetworkLogo network={item.network} />}
              title={<span className="network-name">{item.name}</span>}
              description={
                <div className="item-wrapper-text">
                  <span className="arrive-time">{`Arrival Time ≈ ${item.multiConfirmTime}`}</span>
                  <span className="confirm-times">{item.multiConfirm}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  }, [networkList, onClickItem]);
  const mainContent = useCallback(() => {
    return (
      <div className={clsx('deposit-select-network-container', isPrompt ? 'detail-page-prompt' : '')}>
        <CommonHeader title={'Select Network'} onLeftBack={onClose} />
        <div className="body flex-1">
          {renderNotice}
          {renderList}
        </div>
      </div>
    );
  }, [isPrompt, onClose, renderList, renderNotice]);
  return <>{isPrompt && type === 'page' ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
