import { Modal, ModalProps } from 'antd';
import CustomChainSelect, { ICustomChainSelectProps } from '../CustomChainSelect';
import './index.less';

type ICustomChainSelectModalProps = ModalProps & ICustomChainSelectProps;

export default function CustomTokenModal({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
  ...props
}: ICustomChainSelectModalProps) {
  return (
    <Modal
      destroyOnClose
      {...props}
      wrapClassName="custom-token-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}>
      <CustomChainSelect
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={onClose}
        onChange={onChange}
      />
    </Modal>
  );
}
