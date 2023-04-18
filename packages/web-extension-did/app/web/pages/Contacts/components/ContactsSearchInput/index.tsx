import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { ChangeEventHandler } from 'react';
import clsx from 'clsx';
import './index.less';

export default function ContactsSearchInput({
  handleChange,
  className,
}: {
  handleChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}) {
  return (
    <Input
      className={clsx(['contacts-search-input', className])}
      prefix={<CustomSvg type="SearchBlur" className="search-svg" />}
      placeholder="Name or Address"
      onChange={handleChange}
    />
  );
}
