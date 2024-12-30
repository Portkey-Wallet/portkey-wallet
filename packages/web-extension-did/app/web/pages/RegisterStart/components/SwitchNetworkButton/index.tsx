import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useWalletInfo } from 'store/Provider/hooks';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { Row } from 'antd';

export default function SwitchNetworkButton({ redirect = true }: { redirect?: boolean }) {
  const { currentNetwork } = useWalletInfo();
  const changeNetwork = useChangeNetwork();
  const networkList = useNetworkList();
  const networkChange = useThrottleCallback(() => {
    changeNetwork(networkList.filter((item) => item.networkType !== currentNetwork)[0], redirect);
  }, [changeNetwork, currentNetwork, networkList, redirect]);
  return (
    <div className="flex-row-center switch-network-button" onClick={networkChange}>
      <CustomSvg type="Change" />
      <div>{currentNetwork === 'MAINNET' ? 'Mainnet' : 'Testnet'}</div>
    </div>
  );
}

export function BackAndSwitchNetwork({ onClick, redirect = true }: { onClick?: () => void; redirect?: boolean }) {
  return (
    <Row className="flex-row-center flex-between">
      <CustomSvg type="BackLeft" onClick={onClick} />
      <SwitchNetworkButton redirect={redirect} />
    </Row>
  );
}
