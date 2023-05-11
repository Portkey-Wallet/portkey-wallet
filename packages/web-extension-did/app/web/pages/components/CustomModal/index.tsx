import { Modal } from 'antd';
import { ReactNode } from 'react';
import './index.less';

export interface ICustomModalProps {
  type?: 'info' | 'confirm';
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const CustomModal = ({ type, content, okText, onCancel, onOk, cancelText }: ICustomModalProps) => {
  const props = {
    open: true,
    width: 320,
    icon: null,
    closable: false,
    centered: true,
    autoFocusButton: null,
    okButtonProps: {
      loading: false,
    },
  };

  return type === 'confirm'
    ? Modal.confirm({
        ...props,
        className: 'confirm-modal',
        okText: okText || 'OK',
        cancelText: cancelText || 'Cancel',
        content,
        onOk: onOk,
        onCancel: onCancel,
      })
    : Modal.info({
        ...props,
        className: 'info-modal',
        okText: okText || 'OK',
        content,
        onOk: onOk,
      });
};

export default CustomModal;
