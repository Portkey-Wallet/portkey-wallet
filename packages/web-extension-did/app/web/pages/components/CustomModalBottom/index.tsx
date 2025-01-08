import { Modal, ModalFuncProps } from 'antd';
import Drawer from './Drawer';
import { ReactNode } from 'react';
import './index.less';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export interface ICustomModalBottomProps extends ModalFuncProps {
  type?: 'info' | 'confirm' | 'warning';
  noFooter?: boolean;
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  className?: string;
  onOk?: () => void;
  onCancel?: () => void;
  title?: ReactNode;
  isPrompt?: boolean;
  promptInfo?: {
    width?: number;
  };
}

type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps);
interface IModal {
  destroy: () => void;
  update: (configUpdate: ConfigUpdate) => void;
}

export const CustomModal = {
  destroyAll: () => {
    Modal.destroyAll();
    Drawer.destroyAll();
  },
};

export const CustomModalBottom = ({
  type,
  noFooter = false,
  content,
  okText,
  onCancel,
  onOk,
  cancelText,
  className,
  title,
  isPrompt = false,
  promptInfo,
  ...extraProps
}: ICustomModalBottomProps) => {
  const props = {
    open: true,
    width: isPrompt ? promptInfo?.width || 400 : '100%',
    style: isPrompt
      ? {}
      : {
          maxWidth: '100%',
          'max-width': '100%',
          verticalAlign: 'bottom',
        },
    mask: true,
    maskClosable: true,
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

  const noFooterClassName = noFooter ? 'modal-no-footer' : '';
  const promptClassName = isPrompt ? 'modal-bottom-prompt' : '';
  const Component = isPrompt ? Modal : Drawer;

  switch (type) {
    case 'confirm': {
      const modal = Component.confirm({});
      modal.update({
        ...props,
        className: clsx(['confirm-modal-bottom', noFooterClassName, promptClassName, className]),
        okText: okText || 'OK',
        cancelText: cancelText || 'Cancel',
        content: <ExtendedContent modal={modal} title={title} />,
        onOk: onOk,
        onCancel: onCancel,
        ...extraProps,
      });
      return modal;
    }
    case 'warning': {
      const modal = Component.confirm({});
      modal.update({
        ...props,
        className: clsx(['warning-modal-bottom', noFooterClassName, promptClassName, className]),
        okText: okText || 'OK',
        cancelText: cancelText || 'Cancel',
        content: <ExtendedContent modal={modal} title={title} />,
        onOk: onOk,
        onCancel: onCancel,
        okButtonProps: { danger: true },
        ...extraProps,
      });
      return modal;
    }
    // case 'info':
    default: {
      const modal = Modal.info({});
      modal.update({
        ...props,
        className: clsx(['info-modal-bottom', noFooterClassName, promptClassName, className]),
        okText: okText || 'OK',
        content: <ExtendedContent modal={modal} title={title} />,
        onOk: onOk,
        ...extraProps,
      });
      return modal;
    }
  }
};
