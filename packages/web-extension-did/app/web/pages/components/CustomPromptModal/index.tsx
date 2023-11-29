import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import './index.less';

type ICustomTokenModalProps = ModalProps & { onClose: () => void };
export default function CustomPromptModal({ onClose, wrapClassName, ...props }: ICustomTokenModalProps) {
  return (
    <Modal
      {...props}
      wrapClassName={clsx(['custom-prompt-modal', wrapClassName])}
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}
    />
  );
}
