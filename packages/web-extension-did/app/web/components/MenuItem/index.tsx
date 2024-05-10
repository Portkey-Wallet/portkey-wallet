import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { ReactNode } from 'react';
import './index.less';

export interface MenuItemProps {
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: (v?: any) => void;
  height?: number;
  showEnterIcon?: boolean;
  className?: string;
}

export default function MenuItem({
  icon,
  children,
  onClick,
  className,
  height = 57,
  showEnterIcon = true,
}: MenuItemProps) {
  return (
    <div className={clsx('menu-item', className)} style={{ height }} onClick={onClick}>
      {icon && <div className="icon-area">{icon}</div>}
      <span className="menu-item-title">{children}</span>
      {showEnterIcon && <CustomSvg className="enter-btn" type="Arrow" />}
    </div>
  );
}
