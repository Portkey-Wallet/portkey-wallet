import MenuItem from 'components/MenuItem';
import clsx from 'clsx';
import { ReactNode } from 'react';

export interface MenuItemInfo {
  key: number | string;
  element: ReactNode;
  click: () => void;
}

export interface IMenuItemProps {
  list: MenuItemInfo[];
  height?: number;
  className?: string;
  isShowSelectedColor?: boolean;
  selected?: number | string;
}

export default function MenuList({
  list,
  height = 64,
  className,
  isShowSelectedColor = false,
  selected,
}: IMenuItemProps) {
  return (
    <div className={clsx(['menu-list', className])}>
      {list.map((item) => (
        <MenuItem
          key={item.key}
          className={isShowSelectedColor && selected === item.key ? 'item-selected' : undefined}
          height={height}
          onClick={item.click}>
          {item.element}
        </MenuItem>
      ))}
    </div>
  );
}
