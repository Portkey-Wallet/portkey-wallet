import CustomSelect from 'pages/components/CustomSelect';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { IAutoLockProps } from '..';
import './index.less';

export default function AutoLockPrompt({
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
    <div className="auto-lock-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
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
