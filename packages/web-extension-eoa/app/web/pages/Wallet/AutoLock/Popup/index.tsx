import CommonHeader from 'components/CommonHeader';
import CustomSelect from 'pages/components/CustomSelect';
import { IAutoLockProps } from '..';
import './index.less';

export default function AutoLockPopup({
  className,
  headerTitle,
  goBack,
  label,
  list,
  defaultValue,
  value,
  onChange,
}: IAutoLockProps) {
  return (
    <div className="auto-lock-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <div className="auto-lock-body">
        <div className="label">{label}</div>
        <CustomSelect
          className={className}
          items={list}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
