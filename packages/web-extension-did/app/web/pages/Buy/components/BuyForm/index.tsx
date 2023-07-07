import { PartialFiatType } from 'pages/Buy/const';
import CurrencyInput from '../CurrencyInput';
import TokenInput, { ICurToken } from '../TokenInput';
import { IKeyDownParams } from 'types';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';
import { useTranslation } from 'react-i18next';

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
  warningMsg?: string;
  side: PaymentTypeEnum;
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
  side,
}: IBuyOrSellFromProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="buy-input">
        <div className="label">{`I want to pay`}</div>
        <CurrencyInput
          value={currencyVal}
          side={side}
          onChange={handleCurrencyChange}
          readOnly={false}
          onKeyDown={handleCurrencyKeyDown}
          curFiat={curFiat}
          onSelect={handleCurrencySelect}
        />
        {!!errMsg && <div className="error-text">{t(errMsg)}</div>}
      </div>
      <div className="buy-input">
        <div className="label">{`I will receive≈`}</div>

        <TokenInput
          value={tokenVal}
          side={side}
          onChange={handleTokenChange}
          readOnly={true}
          onKeyDown={handleTokenKeyDown}
          curToken={curToken}
          onSelect={handleTokenSelect}
        />
      </div>
    </>
  );
}
