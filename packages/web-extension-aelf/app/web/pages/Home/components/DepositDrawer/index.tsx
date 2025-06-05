import { DrawerProps } from 'antd';
import BaseDrawer from 'pages/components/BaseDrawer';
import DepositList, { IDepositListProps } from '../DepositList';
import './index.less';

interface IDepositDrawerProps extends IDepositListProps, DrawerProps {
  onClose: () => void;
}

export default function DepositDrawer({ onClose, onClickBridge, onClickETrans, ...props }: IDepositDrawerProps) {
  return (
    <BaseDrawer placement="bottom" {...props} destroyOnClose onClose={onClose} className="deposit-drawer">
      <DepositList onClose={onClose} onClickBridge={onClickBridge} onClickETrans={onClickETrans} />
    </BaseDrawer>
  );
}
