import { Modal, ModalProps } from 'antd';
import CustomChainSelect, { ICustomChainSelectProps } from '../CustomChainSelect';
import './index.less';

type ICustomChainSelectModalProps = ModalProps & ICustomChainSelectProps;

export default function CustomChainSelectModal({ onChange, onClose, ...props }: ICustomChainSelectModalProps) {
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
      <CustomChainSelect onClose={onClose} onChange={onChange} item={props.item} />
    </Modal>
  );
}
