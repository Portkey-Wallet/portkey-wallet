import { Modal, ModalProps } from 'antd';
import TokenNetworkList, { ITokenNetworkListProps } from '../TokenNetworkList';
import './index.less';

type ICustomTokenModalProps = ModalProps & ITokenNetworkListProps;

export default function TokenNetworkModal({ onChange, onClose, drawerType, ...props }: ICustomTokenModalProps) {
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
      <TokenNetworkList drawerType={drawerType} onClose={onClose} onChange={onChange} />
    </Modal>
  );
}
