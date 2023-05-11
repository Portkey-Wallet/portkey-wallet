import { DrawerProps } from 'antd';
import { DrawerType } from 'pages/Buy/const';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import SelectList from '../SelectList';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  onChange?: (v: any) => void;
  onClose: () => void;
  searchPlaceHolder?: string;
  drawerType: DrawerType;
}

export default function CustomModal({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  ...props
}: CustomSelectProps) {
  return (
    <CustomPromptModal {...props} onClose={onClose} destroyOnClose className="buy-modal">
      <SelectList
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </CustomPromptModal>
  );
}
