import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useState } from 'react';
import { IKeyDownParams } from 'types';
import SelectCryptoListWrap from '../SelectList/SelectCryptoListWrap';
import { IRampCryptoItem } from '@portkey-wallet/ramp';

export interface ICryptoInputProps {
  value: string;
  curCrypto: IRampCryptoItem;
  readOnly: boolean;
  defaultFiat?: string;
  supportList: IRampCryptoItem[];
  onChange?: (val: string) => void;
  onKeyDown: (e: IKeyDownParams) => void;
  onSelect: (v: IRampCryptoItem) => void;
}

const SelectCrypto = 'Select Crypto';
const SearchCrypto = 'Search crypto';

export default function CryptoInput({
  value,
  curCrypto,
  readOnly,
  defaultFiat,
  supportList,
  onChange,
  onKeyDown,
  onSelect,
}: ICryptoInputProps) {
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
              <img src={curCrypto.icon} />
            </div>
            <div className="currency">{curCrypto.symbol}</div>
            <CustomSvg type="DirectionDown" />
          </div>
        }
      />
      <SelectCryptoListWrap
        title={SelectCrypto}
        searchPlaceHolder={SearchCrypto}
        open={openDrawer}
        defaultFiat={defaultFiat}
        supportList={supportList}
        onClose={() => setOpenDrawer(false)}
        onChange={onSelect}
      />
    </>
  );
}
