import { Radio, RadioChangeEvent } from 'antd';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import './index.less';

export interface IRadioTabProps {
  className?: string;
  radioList: { value: string; label?: string }[];
  defaultValue?: string;
  onChange: (target: any) => void;
}

export default function RadioTab({
  className,
  radioList,
  onChange,
  defaultValue = radioList[0]?.value,
}: IRadioTabProps) {
  const [selectVal, setSelectVal] = useState(radioList[0]?.value);
  const changeSelect = useCallback(
    (e: RadioChangeEvent) => {
      const _target = e.target.value;
      setSelectVal(_target);
      onChange(_target);
    },
    [onChange],
  );
  return (
    <div className={clsx('radio-tab-wrap', className)}>
      <Radio.Group defaultValue={defaultValue} buttonStyle="solid" value={selectVal} onChange={changeSelect}>
        {radioList.map((item, index) => (
          <Radio.Button key={`${item.value}_${index}`} value={item.value}>
            {item.label ?? item.value}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}
