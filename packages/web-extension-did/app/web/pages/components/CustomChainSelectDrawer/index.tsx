import { DrawerProps } from 'antd';
import BaseDrawer from '../BaseDrawer';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import './index.less';
import CustomChainSelect from '../CustomChainSelect';

interface CustomChainSelectProps extends DrawerProps {
  onChange?: (v: IAssetItemType, type: 'token' | 'nft') => void;
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
}: CustomChainSelectProps) {
  return (
    <BaseDrawer {...props} destroyOnClose onClose={onClose} className="custom-token-drawer">
      <CustomChainSelect
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </BaseDrawer>
  );
}
