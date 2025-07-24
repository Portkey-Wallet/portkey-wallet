import React from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

export interface CheckBoxProps {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  checkedColor?: string;
  uncheckedColor?: string;
  labelStyle?: React.CSSProperties;
  boxStyle?: React.CSSProperties;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label = '', checked, onChange, labelStyle = {}, boxStyle = {} }) => {
  const handleClick = () => {
    if (onChange) onChange(!checked);
  };
  return (
    <span className="portkey-checkbox-container" style={boxStyle} onClick={handleClick}>
      <CustomSvgV3 type={checked ? 'checkbox-checked-v2' : 'checkbox-new'} className="portkey-checkbox-icon" />
      {label && (
        <span className="portkey-checkbox-label" style={labelStyle}>
          {label}
        </span>
      )}
    </span>
  );
};

export default CheckBox;
