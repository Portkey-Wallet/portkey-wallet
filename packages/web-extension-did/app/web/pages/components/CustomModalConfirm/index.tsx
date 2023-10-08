import { Modal } from 'antd';
import { ReactNode } from 'react';
import './index.less';

export interface ICustomModalConfirmProps {
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const CustomModalConfirm = ({ content, okText, onCancel, onOk, cancelText }: ICustomModalConfirmProps) => {
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

  return Modal.confirm({
    ...props,
    className: 'custom-modal-confirm',
    okText: okText || 'OK',
    cancelText: cancelText || 'Cancel',
    content,
    onOk: onOk,
    onCancel: onCancel,
  });
};

export default CustomModalConfirm;
