import { DrawerType, PartialFiatType } from 'pages/Buy/const';
import { useCommonState } from 'store/Provider/hooks';
import CustomModal from '../../components/CustomModal';
import CustomDrawer from '../../components/CustomDrawer';

interface ISuffixSelectProps {
  drawerType: DrawerType;
  open: boolean;
  onClose: () => void;
  onSelect: (v: PartialFiatType) => void;
}

export default function SuffixSelect({ drawerType, open, onClose, onSelect }: ISuffixSelectProps) {
  const { isPrompt } = useCommonState();
  const title = drawerType === DrawerType.token ? 'Select Crypto' : 'Select Currency';
  const searchPlaceHolder = drawerType === DrawerType.token ? 'Search crypto' : 'Search currency';
  return isPrompt ? (
    <CustomModal
      open={open}
      drawerType={drawerType}
      title={title}
      searchPlaceHolder={searchPlaceHolder}
      onClose={onClose}
      onChange={(v) => onSelect(v)}
    />
  ) : (
    <CustomDrawer
      open={open}
      drawerType={drawerType}
      title={title}
      searchPlaceHolder={searchPlaceHolder}
      height="528"
      maskClosable={true}
      placement="bottom"
      onClose={onClose}
      onChange={(v) => onSelect(v)}
    />
  );
}
