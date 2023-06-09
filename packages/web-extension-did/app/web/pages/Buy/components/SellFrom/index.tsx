import CurrencyInput from '../CurrencyInput';
import TokenInput from '../TokenInput';
import { IBuyOrSellFromProps } from '../BuyFrom';

export default function SellFrom({
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
        <div className="label">{`I want to sell`}</div>
        <TokenInput
          value={tokenVal}
          onChange={(val) => handleTokenChange(val)}
          readOnly={false}
          onKeyDown={handleTokenKeyDown}
          curToken={curToken}
          onSelect={(v) => handleTokenSelect(v)}
        />
        {!!errMsg && <div className="error-text">{errMsg}</div>}
      </div>
      <div className="buy-input">
        <div className="label">{`I will receive≈`}</div>
        <CurrencyInput
          value={currencyVal}
          onChange={(val) => handleCurrencyChange(val)}
          readOnly={true}
          onKeyDown={handleCurrencyKeyDown}
          curFiat={curFiat}
          onSelect={(v) => handleCurrencySelect(v)}
        />
      </div>
    </>
  );
}
