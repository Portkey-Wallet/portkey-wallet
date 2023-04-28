import { Modal, ModalProps } from 'antd';
import './index.less';

type ICustomTokenModalProps = ModalProps & { onClose: () => void };
export default function CustomPromptModal({ onClose, ...props }: ICustomTokenModalProps) {
  return (
    <Modal
      {...props}
      wrapClassName="custom-prompt-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}
    />
  );
}
