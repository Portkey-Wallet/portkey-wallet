import { Input } from 'antd';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { ChangeEventHandler } from 'react';
import clsx from 'clsx';
import './index.less';

export default function ContactsSearchInput({
  isEmpty = true,
  handleChange,
  className,
  placeholder = 'Name, Address',
}: {
  isEmpty: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  placeholder?: string;
}) {
  return (
    <Input
      className={clsx(['contacts-search-input', className])}
      suffix={isEmpty ? <CustomSvgV3 type="SearchBlur" className="search-svg" /> : undefined}
      allowClear={{ clearIcon: <CustomSvgV3 type="close-circle" className="search-svg" /> }}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
}
