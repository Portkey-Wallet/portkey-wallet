import { DrawerProps, ModalProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';
import CustomPromptModal from 'pages/components/CustomPromptModal';
import SelectCryptoList from '../SelectCryptoList';
import { IRampCryptoItem } from '@portkey-wallet/ramp';

interface SelectCryptoListWrapPartialProps {
  title: string;
  searchPlaceHolder?: string;
  defaultFiat?: string;
  supportList: IRampCryptoItem[];
  onChange?: (v: any) => void;
  onClose: () => void;
}

type SelectCryptoDrawerProps = SelectCryptoListWrapPartialProps & DrawerProps;

type SelectCryptoModalProps = SelectCryptoListWrapPartialProps & ModalProps;

type SelectCryptoListWrapProps = SelectCryptoDrawerProps | SelectCryptoModalProps;

export default function SelectCryptoListWrap({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  defaultFiat,
  supportList,
  ...props
}: SelectCryptoListWrapProps) {
  const { isPrompt } = useCommonState();

  return isPrompt ? (
    <CustomPromptModal {...props} onClose={onClose} destroyOnClose className="ramp-crypto-modal">
      <SelectCryptoList
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        defaultFiat={defaultFiat}
        supportList={supportList}
        onClose={onClose}
        onChange={onChange}
      />
    </CustomPromptModal>
  ) : (
    <BaseDrawer
      {...props}
      onClose={onClose}
      className="ramp-crypto-drawer"
      height={528}
      placement="bottom"
      destroyOnClose>
      <SelectCryptoList
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        defaultFiat={defaultFiat}
        supportList={supportList}
        onClose={onClose}
        onChange={onChange}
      />
    </BaseDrawer>
  );
}
