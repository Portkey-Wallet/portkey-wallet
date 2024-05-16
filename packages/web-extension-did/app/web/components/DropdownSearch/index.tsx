import { Dropdown, DropdownProps, Input, InputProps } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
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
  return (
    <div className={clsx('dropdown-search-wrapper', wrapperClassName)}>
      <Dropdown overlayClassName="empty-dropdown" {...props}>
        <Input
          value={value}
          allowClear
          onPressEnter={onPressEnter}
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          prefix={<CustomSvg type="SearchBlur" style={{ width: 20, height: 20 }} />}
          {...inputProps}
        />
      </Dropdown>
    </div>
  );
}
