import { Modal, ModalFuncProps } from 'antd';
import { ReactNode } from 'react';
import './index.less';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export interface ICustomModalProps extends ModalFuncProps {
  type?: 'info' | 'confirm' | 'warning';
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  className?: string;
  onOk?: () => void;
  onCancel?: () => void;
  title?: string | ReactNode;
}

type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps);
interface IModal {
  destroy: () => void;
  update: (configUpdate: ConfigUpdate) => void;
}

export const CustomModalBottom = ({
  type,
  content,
  okText,
  onCancel,
  onOk,
  cancelText,
  className,
  title,
  ...extraProps
}: ICustomModalProps) => {
  const props = {
    open: true,
    width: '100%',
    style: {
      maxWidth: '100%',
      'max-width': '100%',
      verticalAlign: 'bottom',
    },
    icon: null,
    closable: false,
    centered: true,
    autoFocusButton: null,
    okButtonProps: {
      loading: false,
    },
  };

  const ExtendedContent = ({ modal, title }: { modal?: IModal | undefined; title?: string | ReactNode }) => (
    <div>
      <div className="header">
        <div>{title ? title : <CustomSvgV3 type="error" className="error-icon" />}</div>
        <div
          onClick={() => {
            onCancel && onCancel();
            modal && modal.destroy();
          }}>
          <CustomSvgV3 type="close thin" className="close-thin-icon" />
        </div>
      </div>
      {content}
    </div>
  );

  switch (type) {
    case 'confirm': {
      const modal = Modal.confirm({});
      modal.update({
        ...props,
        className: clsx(['confirm-modal-bottom', className]),
        okText: okText || 'OK',
        cancelText: cancelText || 'Cancel',
        content: <ExtendedContent modal={modal} title={title} />,
        onOk: onOk,
        onCancel: onCancel,
        ...extraProps,
      });
      return;
    }
    case 'warning': {
      const modal = Modal.confirm({});
      modal.update({
        ...props,
        className: clsx(['warning-modal-bottom', className]),
        okText: okText || 'OK',
        cancelText: cancelText || 'Cancel',
        content: <ExtendedContent modal={modal} title={title} />,
        onOk: onOk,
        onCancel: onCancel,
        okButtonProps: { danger: true },
        ...extraProps,
      });
      return;
    }
    // case 'info':
    default: {
      const modal = Modal.info({});
      modal.update({
        ...props,
        className: clsx(['info-modal-bottom', className]),
        okText: okText || 'OK',
        content: <ExtendedContent modal={modal} title={title} />,
        onOk: onOk,
        ...extraProps,
      });
      return;
    }
  }
};
