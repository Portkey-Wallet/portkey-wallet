import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';

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
      {showEnterIcon && <CustomSvgV3 className="enter-btn" type="chevron_right" fillColor="#B2B2B2" />}
    </div>
  );
}
