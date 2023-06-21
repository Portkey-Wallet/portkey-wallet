import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import { DrawerType } from 'pages/Buy/const';
import SelectList from '../SelectList';
import './index.less';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';

interface CustomSelectProps extends DrawerProps {
  onChange?: (v: any) => void;
  onClose?: () => void;
  searchPlaceHolder?: string;
  drawerType: DrawerType;
  side: PaymentTypeEnum;
}

export default function CustomDrawer({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  side,
  ...props
}: CustomSelectProps) {
  return (
    <BaseDrawer {...props} onClose={onClose} className="custom-drawer" destroyOnClose>
      <SelectList
        drawerType={drawerType}
        title={title}
        side={side}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </BaseDrawer>
  );
}
