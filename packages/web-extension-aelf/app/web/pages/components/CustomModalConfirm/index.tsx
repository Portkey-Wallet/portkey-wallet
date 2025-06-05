import { Modal, ModalFuncProps } from 'antd';
import { ReactNode } from 'react';
import './index.less';

export interface ICustomModalConfirmProps extends ModalFuncProps {
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const CustomModalConfirm = ({ content, okText, onCancel, onOk, cancelText, ...props }: ICustomModalConfirmProps) => {
  const _props = {
    open: true,
    width: 320,
    icon: null,
    closable: false,
    centered: true,
    autoFocusButton: null,
    okButtonProps: {
      loading: false,
    },
    ...props,
  };

  return Modal.confirm({
    ..._props,
    className: 'custom-modal-confirm',
    okText: okText || 'OK',
    cancelText: cancelText || 'Cancel',
    content,
    onOk: onOk,
    onCancel: onCancel,
  });
};

export default CustomModalConfirm;
