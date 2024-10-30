import { Radio, RadioChangeEvent } from 'antd';
import { useCallback } from 'react';
import clsx from 'clsx';
import './index.less';

export interface IRadioTabProps {
  className?: string;
  radioList: { value: string | number; label?: string }[];
  activeValue: string | number;
  defaultValue?: string | number;
  onChange: (target: any) => void;
}

export default function RadioTab({
  className,
  radioList,
  onChange,
  activeValue,
  defaultValue = radioList[0]?.value,
}: IRadioTabProps) {
  const changeSelect = useCallback(
    (e: RadioChangeEvent) => {
      const _target = e.target.value;
      onChange(_target);
    },
    [onChange],
  );
  return (
    <div className={clsx('radio-tab-wrap', className)}>
      <Radio.Group defaultValue={defaultValue} buttonStyle="solid" value={activeValue} onChange={changeSelect}>
        {radioList.map((item, index) => (
          <Radio.Button key={`${item.value}_${index}`} value={item.value}>
            {item.label ?? item.value}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}
