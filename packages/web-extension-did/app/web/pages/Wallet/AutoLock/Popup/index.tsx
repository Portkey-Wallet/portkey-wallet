import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
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
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
