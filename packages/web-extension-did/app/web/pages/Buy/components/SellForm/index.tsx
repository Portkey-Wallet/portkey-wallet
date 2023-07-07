import CurrencyInput from '../CurrencyInput';
import TokenInput from '../TokenInput';
import { IBuyOrSellFromProps } from '../BuyForm';
import { useTranslation } from 'react-i18next';

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
  warningMsg,
  side,
}: IBuyOrSellFromProps) {
  const { t } = useTranslation();
  const tokenChange = (val: string) => {
    const arr = val.split('.');
    // No more than eight digits after the decimal point
    if (arr[1]?.length > 8) return;
    // The total number does not exceed 13 digits, not include decimal point
    if (arr.join('').length > 13) return;

    handleTokenChange(val);
  };

  return (
    <>
      <div className="buy-input">
        <div className="label">{`I want to sell`}</div>
        <TokenInput
          value={tokenVal}
          side={side}
          onChange={tokenChange}
          readOnly={false}
          onKeyDown={handleTokenKeyDown}
          curToken={curToken}
          onSelect={handleTokenSelect}
        />
        {!!errMsg && <div className="error-text">{t(errMsg)}</div>}
        {!!warningMsg && <div className="warning-text">{t(warningMsg)}</div>}
      </div>
      <div className="buy-input">
        <div className="label">{`I will receive≈`}</div>
        <CurrencyInput
          value={currencyVal}
          side={side}
          onChange={handleCurrencyChange}
          readOnly={true}
          onKeyDown={handleCurrencyKeyDown}
          curFiat={curFiat}
          onSelect={handleCurrencySelect}
        />
      </div>
    </>
  );
}
