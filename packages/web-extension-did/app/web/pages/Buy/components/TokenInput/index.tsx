import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { DrawerType, PartialFiatType } from 'pages/Buy/const';
import { useState } from 'react';
import SuffixSelect from '../SuffixSelect';
import { IKeyDownParams } from 'types';

export interface ICurToken {
  crypto: string;
  network: string;
}

export interface ITokenInputProps {
  value: string;
  onChange: (val: string) => void;
  readOnly: boolean;
  onKeyDown: (e: IKeyDownParams) => void;
  curToken: ICurToken;
  onSelect: (v: PartialFiatType) => void;
}

export default function TokenInput({ value, onChange, readOnly, onKeyDown, curToken, onSelect }: ITokenInputProps) {
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
            <CustomSvg type="elf-icon" />
            <div className="currency">{curToken.crypto}</div>
            <CustomSvg type="Down" />
          </div>
        }
      />
      <SuffixSelect
        drawerType={DrawerType.token}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSelect={onSelect}
      />
    </>
  );
}
