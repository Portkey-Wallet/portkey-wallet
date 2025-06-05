import { Dropdown, DropdownProps, Input, InputProps } from 'antd';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

interface DropdownSearchProps extends DropdownProps {
  inputProps: InputProps;
  wrapperClassName?: string;
  value?: string;
  onPressEnter?: () => void;
}

export default function DropdownSearch({
  inputProps,
  wrapperClassName,
  value,
  onPressEnter,
  ...props
}: DropdownSearchProps) {
  const clearValue: any = () => {
    if (inputProps?.onChange) {
      const value: any = { target: { value: '' } };
      inputProps?.onChange(value);
    }
  };
  return (
    <div className={clsx('dropdown-search-wrapper', 'web-dropdown-search', wrapperClassName)}>
      <Dropdown overlayClassName="empty-dropdown" {...props}>
        <Input
          value={value}
          onPressEnter={onPressEnter}
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          suffix={value ? <CustomSvgV3 type="Remove" onClick={clearValue} /> : <CustomSvgV3 type="SearchBlur" />}
          {...inputProps}
        />
      </Dropdown>
    </div>
  );
}
