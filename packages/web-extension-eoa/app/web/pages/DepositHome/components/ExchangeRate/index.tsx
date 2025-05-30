import CustomSvg from 'components/CustomSvg';
import './index.less';
import { ChainId } from '@portkey-wallet/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectOnce } from '@portkey-wallet/hooks';
import depositService from '@portkey-wallet/utils/deposit';
import { handleErrorMessage, singleMessage } from '@portkey/did-ui-react';
import { formatSymbolDisplay } from '@portkey-wallet/utils/format';
export interface ICalculatorProps {
  onTimeEnd?: () => void;
  showRateText: string;
  updateTime: number;
}
type TExchangeRate = {
  fromSymbol: string;
  toSymbol: string;
  toChainId: ChainId;
  slippage?: string;
  onFetchNewRate?: () => void;
};
const EXCHANGE_FROM_AMOUNT = '1';
export const defaultNullValue = '--';
export const MAX_UPDATE_TIME = 15;

export default function ExchangeRate({ fromSymbol, toSymbol, toChainId, slippage, onFetchNewRate }: TExchangeRate) {
  const [exchange, setExchange] = useState(defaultNullValue);
  const [updateTime, setUpdateTime] = useState(MAX_UPDATE_TIME);
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timer | number>();
  const slippageFormat = useMemo(() => {
    if (!slippage) return '';
    return Number(slippage) * 100;
  }, [slippage]);

  const getCalculate = useCallback(async () => {
    try {
      const conversionRate = await depositService.depositCalculator({
        toChainId,
        fromSymbol,
        toSymbol,
        fromAmount: EXCHANGE_FROM_AMOUNT,
      });
      setExchange(conversionRate?.toAmount + '' || defaultNullValue);
      onFetchNewRate?.();
    } catch (error) {
      singleMessage.error(handleErrorMessage(error));
    }
  }, [fromSymbol, onFetchNewRate, toChainId, toSymbol]);

  const handleSetTimer = useCallback(async () => {
    updateTimerRef.current = setInterval(() => {
      --updateTimeRef.current;

      if (updateTimeRef.current === 0) {
        getCalculate();
        updateTimeRef.current = MAX_UPDATE_TIME;
      }

      setUpdateTime(updateTimeRef.current);
    }, 1000);
  }, [getCalculate]);

  const stopInterval = useCallback(() => {
    clearInterval(updateTimerRef.current);
    updateTimerRef.current = undefined;
    setExchange(defaultNullValue);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(updateTimerRef.current);
    updateTimerRef.current = undefined;
    updateTimeRef.current = MAX_UPDATE_TIME;
    setUpdateTime(MAX_UPDATE_TIME);
    handleSetTimer();
  }, [handleSetTimer]);

  useEffectOnce(() => {
    getCalculate();
  });

  useEffect(() => {
    resetTimer();
    return () => {
      stopInterval();
    };
  }, [getCalculate, resetTimer, stopInterval]);

  return (
    <div className="deposit-cal-container">
      <div className="deposit-cal-wrapper">
        <span className="transfer-rate">{`1 ${fromSymbol} ≈ ${exchange} ${formatSymbolDisplay(toSymbol)}`}</span>
        <div className="count-down-timer-container">
          <CustomSvg type="Timer" />
          <span className="s">{updateTime}s</span>
        </div>
      </div>
      <span className="slippage">{`Slippage: ${slippageFormat}%`}</span>
    </div>
  );
}
