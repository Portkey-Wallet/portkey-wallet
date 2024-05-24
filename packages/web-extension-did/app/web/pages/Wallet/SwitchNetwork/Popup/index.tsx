import CommonHeader from 'components/CommonHeader';
import NetworkList from 'pages/Wallet/components/NetworkList';
import { ISwitchNetworkProps } from '..';
import './index.less';

export default function SwitchNetworkPopup({ headerTitle, goBack }: ISwitchNetworkProps) {
  return (
    <div className="switch-network-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <NetworkList />
    </div>
  );
}
