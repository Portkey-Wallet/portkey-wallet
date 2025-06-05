import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';

export type TabKey = number | string;
interface ICommonTabsItem {
  key: TabKey;
  label: string;
  number?: number;
  children: React.ReactNode;
}

interface ICommonTabsProps {
  className?: string;
  items: ICommonTabsItem[];
  activeKey?: TabKey;
  onChange?: (key: TabKey) => void;
}

export default function CommonTabs({ className, items, activeKey, onChange }: ICommonTabsProps) {
  const currentContent = useMemo(() => {
    return items.find((item) => item.key === activeKey)?.children;
  }, [activeKey, items]);

  return (
    <div className={clsx('portkey-ui-common-tabs', className)}>
      <div className="portkey-ui-common-tabs-header">
        {items.map((item, index) => (
          <div
            key={index}
            className={clsx('portkey-ui-common-tabs-header-item', {
              'portkey-ui-common-tabs-header-item-active': item.key === activeKey,
            })}
            onClick={() => {
              onChange?.(item.key);
            }}>
            <span className="portkey-ui-common-tabs-header-item-label">{item.label}</span>
            {typeof item.number !== 'undefined' && (
              <div className="portkey-ui-common-tabs-header-item-number">{item.number}</div>
            )}
          </div>
        ))}
      </div>
      <div className="portkey-ui-common-tabs-content">{currentContent}</div>
    </div>
  );
}
