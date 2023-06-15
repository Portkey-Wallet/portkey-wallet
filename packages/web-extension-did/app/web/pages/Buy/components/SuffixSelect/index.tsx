import { DrawerType, PartialFiatType } from 'pages/Buy/const';
import { useCommonState } from 'store/Provider/hooks';
import CustomModal from '../../components/CustomModal';
import CustomDrawer from '../../components/CustomDrawer';
import { useMemo } from 'react';

interface ISuffixSelectProps {
  drawerType: DrawerType;
  open: boolean;
  onClose: () => void;
  onSelect: (v: PartialFiatType) => void;
}

const SelectCrypto = 'Select Crypto';
const SelectCurrency = 'Select Currency';
const SearchCrypto = 'Search crypto';
const SearchCurrency = 'Search currency';

export default function SuffixSelect({ drawerType, open, onClose, onSelect }: ISuffixSelectProps) {
  const { isPrompt } = useCommonState();
  const title = useMemo(() => (drawerType === DrawerType.token ? SelectCrypto : SelectCurrency), [drawerType]);
  const searchPlaceHolder = useMemo(
    () => (drawerType === DrawerType.token ? SearchCrypto : SearchCurrency),
    [drawerType],
  );
  return isPrompt ? (
    <CustomModal
      open={open}
      drawerType={drawerType}
      title={title}
      searchPlaceHolder={searchPlaceHolder}
      onClose={onClose}
      onChange={onSelect}
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
      onChange={onSelect}
    />
  );
}
