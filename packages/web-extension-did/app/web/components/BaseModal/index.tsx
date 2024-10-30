import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import './index.less';

export default function BaseModal({ className, width, ...props }: ModalProps) {
  return <Modal {...props} width={width ?? '520px'} className={clsx('base-modal', className)} />;
}
