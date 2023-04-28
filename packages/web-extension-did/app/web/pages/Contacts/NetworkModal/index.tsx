import { Modal, ModalProps } from 'antd';
import NetworkSelect, { INetworkSelectProps } from '../components/NetworkSelect';
import './index.less';

type INetworkModalProps = INetworkSelectProps & ModalProps;

export default function NetworkModal({ onClose, onChange, ...props }: INetworkModalProps) {
  return (
    <Modal
      wrapClassName="switch-network-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}
      {...props}>
      <NetworkSelect onChange={onChange} onClose={onClose}></NetworkSelect>
    </Modal>
  );
}
