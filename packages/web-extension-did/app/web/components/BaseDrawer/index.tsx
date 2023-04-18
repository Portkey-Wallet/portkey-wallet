import { Drawer, DrawerProps } from 'antd';
import clsx from 'clsx';
import './index.less';

export default function BaseDrawer({ className, width, ...props }: DrawerProps) {
  return <Drawer closable={false} {...props} width={width ?? '100%'} className={clsx('base-drawer', className)} />;
}
