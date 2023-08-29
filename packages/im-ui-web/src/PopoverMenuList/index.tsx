import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.less';

export interface IPopoverMenuListData {
  key: number | string;
  leftIcon?: ReactNode;
  children?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: (v?: any) => void;
  height?: number;
  className?: string;
}

export interface IPopoverMenuListProps {
  className?: string;
  data?: IPopoverMenuListData[];
}

export default function PopoverMenuList(props: IPopoverMenuListProps) {
  const { className, data = [] } = props;
  return (
    <div className={clsx(['popover-menu-list flex-column', className])}>
      {data.map((item) => (
        <div
          key={item.key}
          className={clsx('menu-item flex', className)}
          style={{ height: item.height }}
          onClick={item.onClick}>
          {item.leftIcon && <div className="icon-left">{item.leftIcon}</div>}
          <span className="menu-item-container">{item.children}</span>
          {item.rightIcon && <div className="icon-right">{item.rightIcon}</div>}
        </div>
      ))}
    </div>
  );
}
