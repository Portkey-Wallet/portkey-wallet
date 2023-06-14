import { PartialFiatType } from 'pages/Buy/const';
import CurrencyInput from '../CurrencyInput';
import TokenInput, { ICurToken } from '../TokenInput';
import { IKeyDownParams } from 'types';

export interface IBuyOrSellFromProps {
  currencyVal: string;
  handleCurrencyChange: (val: string) => void;
  handleCurrencyKeyDown: (e: IKeyDownParams) => void;
  handleCurrencySelect: (v: PartialFiatType) => void;
  curFiat: PartialFiatType;

  tokenVal: string;
  handleTokenChange: (val: string) => void;
  handleTokenKeyDown: (e: IKeyDownParams) => void;
  handleTokenSelect: (v: PartialFiatType) => void;
  curToken: ICurToken;

  errMsg: string;
}

export default function BuyFrom({
  currencyVal,
  handleCurrencyChange,
  handleCurrencyKeyDown,
  handleCurrencySelect,
  curFiat,

  tokenVal,
  handleTokenChange,
  handleTokenKeyDown,
  handleTokenSelect,
  curToken,

  errMsg,
}: IBuyOrSellFromProps) {
  return (
    <>
      <div className="buy-input">
        <div className="label">{`I want to pay`}</div>
        <CurrencyInput
          value={currencyVal}
          onChange={handleCurrencyChange}
          readOnly={false}
          onKeyDown={handleCurrencyKeyDown}
          curFiat={curFiat}
          onSelect={(v) => handleCurrencySelect(v)}
        />
        {!!errMsg && <div className="error-text">{errMsg}</div>}
      </div>
      <div className="buy-input">
        <div className="label">{`I will receive≈`}</div>

        <TokenInput
          value={tokenVal}
          onChange={handleTokenChange}
          readOnly={true}
          onKeyDown={handleTokenKeyDown}
          curToken={curToken}
          onSelect={(v) => handleTokenSelect(v)}
        />
      </div>
    </>
  );
}
