import React from 'react';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

export function ExchangeList({ className }: { className?: string }) {
  return (
    <div className={clsx('flex-row-center', 'exchange-list', className)}>
      <CustomSvgV3 type="binance" />
      <CustomSvgV3 type="okx" />
      <CustomSvgV3 type="upbit" />
      <CustomSvgV3 type="bithumb" />
      <CustomSvgV3 type="gate_io" />
      <CustomSvgV3 type="mexc" />
      <CustomSvgV3 type="hotcoin" />
    </div>
  );
}

export function ExchangeTypeShow() {
  return (
    <div className="support-exchange flex-column">
      <CustomSvgV3 type="info_circle" className="info-circle-icon" />
      <div className="text-show">{`Supported exchanges`}</div>
      <ExchangeList />
    </div>
  );
}

export enum AddressTypeEnum {
  EXCHANGE = 'exchange',
  NON_EXCHANGE = 'non-exchange',
}

interface IAddressTypeSelectProps {
  value: AddressTypeEnum;
  onChangeValue: (v: AddressTypeEnum) => void;
}

export const AddressTypeSelect: React.FC<IAddressTypeSelectProps> = (props) => {
  const { value, onChangeValue } = props;

  return (
    <div className="address-type-select-wrap flex-column">
      <div
        className={clsx('exchange-container address-type-item', value === AddressTypeEnum.EXCHANGE && 'selected-item')}
        onClick={() => onChangeValue(AddressTypeEnum.EXCHANGE)}>
        <div className="flex-between-center">
          <div>{`Yes, send to an exchange`}</div>
          {value === AddressTypeEnum.EXCHANGE && <CustomSvgV3 fillColor="#B8E1FF" type="check_circle" />}
        </div>
        <ExchangeList />
      </div>
      <div
        className={clsx(
          'address-type-item',
          'non-exchange-container',
          'flex-between-center',
          value === AddressTypeEnum.NON_EXCHANGE && 'selected-item',
        )}
        onClick={() => onChangeValue(AddressTypeEnum.NON_EXCHANGE)}>
        <div>{`No, it's a non-exchange address`}</div>
        {value === AddressTypeEnum.NON_EXCHANGE && <CustomSvgV3 fillColor="#B8E1FF" type="check_circle" />}
      </div>
    </div>
  );
};

export default AddressTypeSelect;
