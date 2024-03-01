import { DrawerProps, ModalProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import SelectFiatList from '../SelectFiatList';
import { IRampFiatItem } from '@portkey-wallet/ramp';

interface SelectFiatListWrapPartialProps {
  title: string;
  searchPlaceHolder?: string;
  defaultCrypto?: string;
  network?: string;
  onChange?: (v: IRampFiatItem) => void;
  onClose: () => void;
}

type SelectFiatDrawerProps = SelectFiatListWrapPartialProps & DrawerProps;

type SelectFiatModalProps = SelectFiatListWrapPartialProps & ModalProps;

type SelectFiatListWrapProps = SelectFiatDrawerProps | SelectFiatModalProps;

export default function SelectFiatListWrap({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  defaultCrypto,
  network,
  ...props
}: SelectFiatListWrapProps) {
  const { isPrompt } = useCommonState();

  return isPrompt ? (
    <CustomPromptModal {...props} onClose={onClose} destroyOnClose className="ramp-fiat-modal">
      <SelectFiatList
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        defaultCrypto={defaultCrypto}
        network={network}
        onClose={onClose}
        onChange={onChange}
      />
    </CustomPromptModal>
  ) : (
    <BaseDrawer {...props} onClose={onClose} className="ramp-fiat-drawer" destroyOnClose>
      <SelectFiatList
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        defaultCrypto={defaultCrypto}
        network={network}
        onClose={onClose}
        onChange={onChange}
      />
    </BaseDrawer>
  );
}
