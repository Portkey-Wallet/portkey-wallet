import CommonHeader from 'components/CommonHeader';
import MenuItem from 'components/MenuItem';
import { IAutoLockProps } from '..';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useEffect, useState } from 'react';

export default function AutoLockPopup({
  headerTitle,
  goBack,
  // label,
  list,
  defaultValue,
  value,
  onChange,
}: IAutoLockProps) {
  const [timeSelect, setTimeSelect] = useState<string>(value || defaultValue);
  useEffect(() => {
    setTimeSelect(value || defaultValue);
  }, [value, defaultValue]);
  return (
    <div className="auto-lock-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <div className="auto-lock-body">
        {list.map((item, index) => {
          return (
            <MenuItem
              key={index}
              height={48}
              showEnterIcon={false}
              onClick={() => {
                setTimeSelect(item.value);
                onChange(item.value);
              }}>
              <div className="flex-between">
                {item.children}
                {item.value === timeSelect && (
                  <div>
                    <CustomSvgV3 type="check_circle" className="check-circle-icon" fillColor="#B8E1FF" />
                  </div>
                )}
              </div>
            </MenuItem>
          );
        })}
      </div>
    </div>
  );
}
