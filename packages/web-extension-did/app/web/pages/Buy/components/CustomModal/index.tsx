import { DrawerProps } from 'antd';
import { DrawerType } from 'pages/Buy/const';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import SelectList from '../SelectList';
import './index.less';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';

interface CustomSelectProps extends DrawerProps {
  onChange?: (v: any) => void;
  onClose: () => void;
  searchPlaceHolder?: string;
  drawerType: DrawerType;
  side: PaymentTypeEnum;
}

export default function CustomModal({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  side,
  ...props
}: CustomSelectProps) {
  return (
    <CustomPromptModal {...props} onClose={onClose} destroyOnClose className="buy-modal">
      <SelectList
        drawerType={drawerType}
        title={title}
        side={side}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </CustomPromptModal>
  );
}
