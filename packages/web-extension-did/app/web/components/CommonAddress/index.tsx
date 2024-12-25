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
    <div className="extension-common-address-container">
      {!!label && <div className={`extension-common-address-title ${labelClassName}`}>{label}</div>}
      <div className={`extension-common-address-wrapper ${valueWrapperClassName}`}>
        <div className={`extension-common-address ${valueClassName}`}>{value}</div>
        {showCopy && !!value && <Copy toCopy={value || ''} size={copySize} />}
      </div>
    </div>
  );
}
