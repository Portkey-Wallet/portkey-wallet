import clsx from 'clsx';
import { IPopoverMenuListData, IPopoverMenuListProps } from '../type';
import './index.less';

export default function PopoverMenuList(props: IPopoverMenuListProps) {
  const { className, data = [] } = props;
  return (
    <div className={clsx(['popover-menu-list flex-column', className])}>
      {data.map((item: IPopoverMenuListData) => (
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
