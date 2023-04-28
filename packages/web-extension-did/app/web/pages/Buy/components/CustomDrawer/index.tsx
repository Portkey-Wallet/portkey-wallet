import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import { DrawerType } from 'pages/Buy/const';
import SelectList from '../SelectList';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  onChange?: (v: any) => void;
  onClose?: () => void;
  searchPlaceHolder?: string;
  drawerType: DrawerType;
}

export default function CustomDrawer({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  ...props
}: CustomSelectProps) {
  return (
    <BaseDrawer {...props} onClose={onClose} className="custom-drawer" destroyOnClose>
      <SelectList
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </BaseDrawer>
  );
}
