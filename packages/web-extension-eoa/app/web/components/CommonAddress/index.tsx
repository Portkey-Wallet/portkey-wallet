import Copy, { CopySize } from 'components/CopyAddress';
import './index.less';

interface CommonAddressProps {
  labelClassName?: string;
  valueClassName?: string;
  valueWrapperClassName?: string;
  label?: string;
  value?: string;
  showCopy?: boolean;
  copySize?: CopySize;
}

export default function CommonAddress({
  labelClassName,
  valueClassName,
  valueWrapperClassName,
  label,
  value,
  showCopy = true,
  copySize,
}: CommonAddressProps) {
  return (
    <div className="address-container">
      {!!label && <div className={`address-title ${labelClassName}`}>{label}</div>}
      <div className={`address-wrapper ${valueWrapperClassName}`}>
        <div className={`address ${valueClassName}`}>{value}</div>
        {showCopy && !!value && <Copy toCopy={value || ''} size={copySize} />}
      </div>
    </div>
  );
}
