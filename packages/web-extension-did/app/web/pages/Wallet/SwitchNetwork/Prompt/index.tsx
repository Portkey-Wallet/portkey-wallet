import SecondPageHeader from 'pages/components/SecondPageHeader';
import NetworkList from 'pages/Wallet/components/NetworkList';
import { ISwitchNetworkProps } from '..';
import './index.less';

export default function SwitchNetworkPrompt({ headerTitle, goBack }: ISwitchNetworkProps) {
  return (
    <div className="switch-network-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <NetworkList />
    </div>
  );
}
