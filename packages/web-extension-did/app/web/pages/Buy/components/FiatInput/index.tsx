import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useState } from 'react';
import { IKeyDownParams } from 'types';
import SelectFiatListWrap from '../SelectList/SelectFiatListWrap';
import { IRampFiatItem } from '@portkey-wallet/ramp';

export interface ICurrencyInputProps {
  value: string;
  curFiat: IRampFiatItem;
  readOnly: boolean;
  defaultCrypto?: string;
  network?: string; // chain-chainId
  onChange?: (val: string) => void;
  onKeyDown: (e: IKeyDownParams) => void;
  onSelect: (v: IRampFiatItem) => void;
}

const SelectFiat = 'Select Currency';
const SearchFiat = 'Search currency';

export default function CurrencyInput({
  value,
  curFiat,
  readOnly,
  defaultCrypto,
  network,
  onChange,
  onKeyDown,
  onSelect,
}: ICurrencyInputProps) {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Input
        value={value}
        autoComplete="off"
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
        suffix={
          <div className="flex-center" onClick={() => setOpenDrawer(true)}>
            <div className="img">
              <img src={curFiat.icon} />
            </div>
            <div className="currency">{curFiat.symbol}</div>
            <CustomSvg type="Down" />
          </div>
        }
      />
      <SelectFiatListWrap
        title={SelectFiat}
        searchPlaceHolder={SearchFiat}
        defaultCrypto={defaultCrypto}
        network={network}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onChange={onSelect}
      />
    </>
  );
}
