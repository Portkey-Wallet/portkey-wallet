import { AccountAssetItem } from '@portkey-wallet/types/types-ca/token';
import { DrawerProps } from 'antd';
import BaseDrawer from '../BaseDrawer';
import CustomTokenList from '../CustomTokenList';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  onChange?: (v: AccountAssetItem, type: 'token' | 'nft') => void;
  onClose?: () => void;
  searchPlaceHolder?: string;
  drawerType: 'send' | 'receive';
}

export default function CustomTokenDrawer({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  ...props
}: CustomSelectProps) {
  return (
    <BaseDrawer {...props} onClose={onClose} className="custom-token-drawer">
      <CustomTokenList
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </BaseDrawer>
  );
}
