import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import NetworkList from 'pages/Wallet/components/NetworkList';
import { ISwitchNetworkProps } from '..';
import './index.less';

export default function SwitchNetworkPopup({ headerTitle, goBack }: ISwitchNetworkProps) {
  return (
    <div className="switch-network-popup min-width-max-height">
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <NetworkList />
    </div>
  );
}
