import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { DrawerType, PartialFiatType } from 'pages/Buy/const';
import { useState } from 'react';
import { countryCodeMap } from '@portkey-wallet/constants/constants-ca/payment';
import SuffixSelect from '../SuffixSelect';
import { IKeyDownParams } from 'types';

export interface ICurrencyInputProps {
  value: string;
  onChange: (val: string) => void;
  readOnly: boolean;
  onKeyDown: (e: IKeyDownParams) => void;
  curFiat: PartialFiatType;
  onSelect: (v: PartialFiatType) => void;
}

export default function CurrencyInput({
  value,
  onChange,
  readOnly,
  onKeyDown,
  curFiat,
  onSelect,
}: ICurrencyInputProps) {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Input
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
        suffix={
          <div className="flex-center" onClick={() => setOpenDrawer(true)}>
            <div className="img">
              <img src={countryCodeMap[curFiat.country || '']?.icon} alt="" />
            </div>
            <div className="currency">{curFiat.currency}</div>
            <CustomSvg type="Down" />
          </div>
        }
      />
      <SuffixSelect
        drawerType={DrawerType.currency}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSelect={onSelect}
      />
    </>
  );
}
