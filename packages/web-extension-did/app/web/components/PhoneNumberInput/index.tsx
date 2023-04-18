import { Input } from 'antd';
import clsx from 'clsx';
import AreaCode from 'components/AreaCode';
import CustomSvg from 'components/CustomSvg';
import { useState } from 'react';
import { ISelectCountryCode } from 'store/reducers/loginCache/type';
import './index.less';

interface PhoneNumberInputProps {
  area?: ISelectCountryCode;
  phoneNumber?: string;
  onAreaChange?: (v: ISelectCountryCode) => void;
  onPhoneNumberChange?: (v: string) => void;
  onCancel?: () => void;
}

export default function PhoneNumberInput({
  area,
  phoneNumber,
  onAreaChange,
  onCancel,
  onPhoneNumberChange,
}: PhoneNumberInputProps) {
  const [open, setOpen] = useState<boolean>();

  return (
    <div className="phone-number-input-wrapper">
      <div className="flex phone-number-input">
        <div className="addon-content">
          <div
            className="flex-between-center input-addon"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}>
            <div>{area?.country.code ? `+ ${area.country.code}` : '--'}</div>
            <CustomSvg className={clsx('input-arrow', open && 'open-input-arrow')} type="BackLeft" />
          </div>
        </div>

        <Input
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange?.(e.target.value)}
        />
      </div>
      <AreaCode
        open={open}
        value={area?.country.country}
        onCancel={() => {
          onCancel?.();
          setOpen(false);
        }}
        onChange={(CountryItem) => {
          onAreaChange?.({
            index: CountryItem.country[0],
            country: CountryItem,
          });
          setOpen(false);
        }}
      />
    </div>
  );
}
