import { Drawer, DrawerProps } from 'antd';
import clsx from 'clsx';

export default function BaseDrawer({ className, width, ...props }: DrawerProps) {
  return <Drawer closable={false} {...props} width={width ?? '100%'} className={clsx('base-drawer', className)} />;
}
