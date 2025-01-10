import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useCallback } from 'react';
import './index.less';

export interface INetworkServiceItem {
  serviceName: string;
  multiConfirmTime: string;
  maxAmount: string | number;
}

export interface INetworkItem {
  network: string;
  name: string;
  imageUrl: string;
  serviceList: INetworkServiceItem[];
}

export default function SelectNetwork({
  networkList,
  onSelect,
}: {
  networkList: INetworkItem[];
  onSelect: (item: INetworkItem) => void;
}) {
  const renderItem = useCallback(
    (item: INetworkItem) => {
      const recommendToolItem = item?.serviceList?.[0];
      return (
        <div key={item.name} className="network-item flex-center gap-8 cursor-pointer" onClick={() => onSelect(item)}>
          <TokenImageDisplay className="network-icon" width={42} symbol={item.name} src={item.imageUrl} />
          <div className="network-info flex-between-center flex-1 gap-8">
            <div className="info-name">{item.name}</div>
            {!!recommendToolItem?.multiConfirmTime && (
              <div className="info-duration">{`~${recommendToolItem.multiConfirmTime}`}</div>
            )}
          </div>
        </div>
      );
    },
    [onSelect],
  );

  return (
    <div className="portkey-send-select-network">
      <div className="select-network-header">{`Select network`}</div>
      <div className="select-network-list">{networkList.map((item) => renderItem(item))}</div>
    </div>
  );
}
