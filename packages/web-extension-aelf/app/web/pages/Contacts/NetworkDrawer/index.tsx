import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import NetworkSelect, { INetworkSelectProps } from '../components/NetworkSelect';

type CustomSelectProps = INetworkSelectProps & DrawerProps;

export default function NetworkDrawer({ onChange, onClose, ...props }: CustomSelectProps) {
  return (
    <BaseDrawer {...props} onClose={onClose} className="switch-network-drawer">
      <NetworkSelect onChange={onChange} onClose={onClose}></NetworkSelect>
    </BaseDrawer>
  );
}
