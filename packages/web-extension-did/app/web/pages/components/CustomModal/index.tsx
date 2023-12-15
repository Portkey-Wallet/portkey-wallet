import { Modal, ModalFuncProps } from 'antd';
import { ReactNode } from 'react';
import './index.less';
import clsx from 'clsx';

export interface ICustomModalProps extends ModalFuncProps {
  type?: 'info' | 'confirm';
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  className?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const CustomModal = ({
  type,
  content,
  okText,
  onCancel,
  onOk,
  cancelText,
  className,
  ...extraProps
}: ICustomModalProps) => {
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
        className: clsx(['confirm-modal', className]),
        okText: okText || 'OK',
        cancelText: cancelText || 'Cancel',
        content,
        onOk: onOk,
        onCancel: onCancel,
        ...extraProps,
      })
    : Modal.info({
        ...props,
        className: clsx(['info-modal', className]),
        okText: okText || 'OK',
        content,
        onOk: onOk,
        ...extraProps,
      });
};

export default CustomModal;
