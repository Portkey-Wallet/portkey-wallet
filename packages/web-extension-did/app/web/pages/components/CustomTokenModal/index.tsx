import { Modal, ModalProps } from 'antd';
import CustomTokenList, { ICustomTokenListProps } from '../CustomTokenList';
import './index.less';

type ICustomTokenModalProps = ModalProps & ICustomTokenListProps;

export default function CustomTokenModal({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  ...props
}: ICustomTokenModalProps) {
  return (
    <Modal
      {...props}
      wrapClassName="custom-token-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}>
      <CustomTokenList
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </Modal>
  );
}
