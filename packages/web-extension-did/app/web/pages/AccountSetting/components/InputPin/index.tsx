import clsx from 'clsx';
import CustomPassword from 'components/CustomPassword';
import { ChangeEventHandler } from 'react';
import './index.less';

export interface IInputPinProps {
  label: string;
  value: string;
  placeholder: string;
  errMsg: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}
export default function InputPin({ label, value, placeholder, onChange, errMsg, className }: IInputPinProps) {
  return (
    <div className={clsx(['input-pin', className])}>
      <div className="label">{label}</div>
      <CustomPassword value={value} placeholder={placeholder} onChange={onChange} />
      <div className="error-msg">{errMsg}</div>
    </div>
  );
}
