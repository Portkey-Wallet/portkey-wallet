import CustomSvg from 'components/CustomSvg';
import './index.less';
import { useMemo } from 'react';
import { formatSymbolDisplay } from '@portkey-wallet/utils/format';
export interface ICalculatorProps {
  onTimeEnd?: () => void;
  showRateText: string;
  updateTime: number;
}
type TExchangeRate = {
  fromSymbol: string;
  toSymbol: string;
  unitReceiveAmount?: number;
  rateRefreshTime?: number;
  slippage?: string;
};
const defaultNullValue = '--';

export default function ExchangeSimpleRate({
  fromSymbol,
  toSymbol,
  unitReceiveAmount,
  rateRefreshTime,
  slippage,
}: TExchangeRate) {
  const slippageFormat = useMemo(() => {
    if (!slippage) return '';
    return Number(slippage) * 100;
  }, [slippage]);
  return (
    <div className="deposit-cal-container">
      <div className="deposit-cal-wrapper">
        <span className="transfer-rate">{`1 ${fromSymbol} ≈ ${
          unitReceiveAmount ?? defaultNullValue
        } ${formatSymbolDisplay(toSymbol)}`}</span>
        <div className="count-down-timer-container">
          <CustomSvg type="Timer" />
          <span className="s">{rateRefreshTime}s</span>
        </div>
      </div>
      <span className="slippage">{`Slippage: ${slippageFormat}%`}</span>
    </div>
  );
}
