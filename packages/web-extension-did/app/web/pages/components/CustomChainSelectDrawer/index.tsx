import { DrawerProps } from 'antd';
import BaseDrawer from '../BaseDrawer';
import './index.less';
import CustomChainSelect from '../CustomChainSelect';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';

interface CustomChainSelectProps extends DrawerProps {
  onChange?: (display: boolean, id?: string) => void;
  onClose?: () => void;
  item?: IUserTokenItemResponse;
}

export default function CustomChainSelectDrawer({ onChange, onClose, item, ...props }: CustomChainSelectProps) {
  return (
    <BaseDrawer {...props} destroyOnClose onClose={onClose} className="custom-chain-select-drawer">
      <CustomChainSelect onClose={onClose} onChange={onChange} item={item} />
    </BaseDrawer>
  );
}
