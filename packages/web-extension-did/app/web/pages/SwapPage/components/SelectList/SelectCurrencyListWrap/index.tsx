import { DrawerProps, ModalProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';
import CustomPromptModal, { ICustomTokenModalProps } from 'pages/components/CustomPromptModal';
import SelectCurrencyList from '../SelectCurrencyList';
import { IRampFiatItem } from '@portkey-wallet/ramp';

interface SelectCurrencyListWrapPartialProps {
  title: string;
  searchPlaceHolder?: string;
  defaultCrypto?: string;
  network?: string;
  onChange?: (v: IRampFiatItem) => void;
  onClose: () => void;
}

type SelectCurrencyDrawerProps = SelectCurrencyListWrapPartialProps & DrawerProps;

type SelectCurrencyModalProps = SelectCurrencyListWrapPartialProps & ModalProps;

type SelectCurrencyListWrapProps = SelectCurrencyDrawerProps | SelectCurrencyModalProps;

export default function SelectCurrencyListWrap({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  defaultCrypto,
  network,
  ...props
}: SelectCurrencyListWrapProps) {
  const { isPrompt } = useCommonState();

  return isPrompt ? (
    <CustomPromptModal
      {...(props as ICustomTokenModalProps)}
      onClose={onClose}
      destroyOnClose
      className="ramp-fiat-modal">
      <SelectCurrencyList
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        defaultCrypto={defaultCrypto}
        network={network}
        onClose={onClose}
        onChange={onChange}
      />
    </CustomPromptModal>
  ) : (
    <BaseDrawer
      {...props}
      onClose={onClose}
      className="ramp-fiat-drawer"
      height={528}
      placement="bottom"
      destroyOnClose>
      <SelectCurrencyList
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
