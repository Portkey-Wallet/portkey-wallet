import ReactDOM from 'react-dom/client';
import { Button, Drawer, ConfigProvider } from 'antd';
import clsx from 'clsx';
import './drawer.less';

let drawerInstance: { destroy: any; update?: (updatedOptions: any) => void; close?: () => void } | null = null;

const createContainer = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
};

// Drawer.confirm
function DrawerConfirm(options: any) {
  const container = createContainer();
  const root = ReactDOM.createRoot(container);

  const defaultProps = {
    visible: true,
    closable: false,
    mask: true,
    placement: 'bottom',
    maskClosable: true,
    destroyOnClose: true,
    height: 'auto',
    ...options,
  };

  const onClose = () => {
    if (typeof options.onCancel === 'function') {
      options.onCancel();
    }
    closeDrawer();
  };

  const closeDrawer = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  const renderDrawer = (props: any) => {
    root.render(
      <ConfigProvider prefixCls="portkey">
        <Drawer {...props} className={clsx(['modal-drawer-bottom', props.className])} onClose={onClose}>
          {props.content}
          <div className="portkey-modal-confirm-btns">
            <Button
              onClick={() => {
                if (typeof options.onCancel === 'function') {
                  options.onCancel();
                }
                closeDrawer();
              }}>
              {props.cancelText || 'Cancel'}
            </Button>
            <Button
              type="primary"
              danger={props?.okButtonProps?.danger}
              onClick={() => {
                if (typeof options.onOk === 'function') {
                  options.onOk();
                }
                closeDrawer();
              }}>
              {props.okText || 'OK'}
            </Button>
          </div>
        </Drawer>
      </ConfigProvider>,
    );
  };

  renderDrawer(defaultProps);

  const update = (updatedOptions: any) => {
    renderDrawer({ ...defaultProps, ...updatedOptions });
  };

  const _instance = {
    update,
    close: closeDrawer,
    destroy: closeDrawer,
  };

  drawerInstance = _instance;

  return _instance;
}

export default {
  confirm: DrawerConfirm,
  destroyAll: () => {
    drawerInstance?.destroy();
  },
};
