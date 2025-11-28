import { ZERO } from '@portkey-wallet/constants/misc';
import { useAwakenTokenPrices } from '@portkey-wallet/hooks/hooks-eoa/awaken/state';
import { TCurrency } from '@portkey-wallet/types/awaken';
import clsx from 'clsx';
import { TBalancesV2 } from 'hooks/awaken';
import { TSwapInfo } from 'pages/Swap/SwapForm';
import { useMemo } from 'react';
import { AmountCard } from '../AmountCard';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

interface IAmountCardGroupProps {
  className?: string;
  swapInfo: TSwapInfo;
  setValueIn?: (value: string) => Promise<void>;
  setValueOut?: (value: string) => Promise<void>;
  isErrorIn?: boolean;
  balances: TBalancesV2;
  setTokenIn?: (token: TCurrency) => void;
  setTokenOut?: (token: TCurrency) => void;
  switchToken?: () => void;
}

const AmountCardGroup = ({
  className,
  swapInfo,
  setValueIn,
  setValueOut,
  isErrorIn,
  balances,
  setTokenIn,
  setTokenOut,
  switchToken,
}: IAmountCardGroupProps) => {
  const { price: tokenInPrice } = useAwakenTokenPrices({ symbol: swapInfo.tokenIn?.symbol });
  const { price: tokenOutPrice } = useAwakenTokenPrices({ symbol: swapInfo.tokenOut?.symbol });
  const amountInUsd = useMemo(() => {
    return `$${ZERO.plus(swapInfo.valueIn.trim() || 0)
      .times(tokenInPrice)
      .dp(2)
      .toFixed()}`;
  }, [swapInfo.valueIn, tokenInPrice]);

  const amountUsdPercent = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut || !valueIn || !valueOut) return <></>;

    if (
      !tokenInPrice ||
      tokenInPrice === '0' ||
      !tokenOutPrice ||
      tokenOutPrice === '0' ||
      ZERO.eq(valueIn) ||
      ZERO.eq(valueOut)
    ) {
      return <></>;
    }
    const priceIn = ZERO.plus(valueIn).times(tokenInPrice);
    const priceOut = ZERO.plus(valueOut).times(tokenOutPrice);
    const _impact = priceOut.minus(priceIn).div(priceIn).times(100).dp(2);
    let fontClassName: string | undefined = undefined;
    if (_impact.gt(ZERO)) {
      fontClassName = 'swap-amount-percent-positive';
    } else if (_impact.lt(ZERO)) {
      fontClassName = 'swap-amount-percent-negative';
    }

    return (
      <div className={clsx('swap-amount-percent', fontClassName)}>
        &nbsp;{`(${_impact.gt(ZERO) ? '+' : ''}${_impact.toFixed()}%)`}
      </div>
    );
  }, [swapInfo, tokenInPrice, tokenOutPrice]);

  const amountOutUsd = useMemo(() => {
    return `$${ZERO.plus(swapInfo.valueOut.trim() || 0)
      .times(tokenOutPrice)
      .dp(2)
      .toFixed()}`;
  }, [swapInfo.valueOut, tokenOutPrice]);

  return (
    <div className={clsx('swap-amount-group', className)}>
      <AmountCard
        title="You Pay"
        isInput
        amount={swapInfo.valueIn}
        onAmountChange={setValueIn}
        balance={balances?.[swapInfo.tokenIn?.symbol || '']}
        amountUsd={amountInUsd}
        isError={isErrorIn}
        token={swapInfo.tokenIn}
        onTokenChange={setTokenIn}
        isMaxShow={true}
      />
      <div className="swap-amount-group-switch-wrap" onClick={switchToken}>
        <div className="swap-amount-group-switch-button">
          <CustomSvgV3 type="swap_vert thin" className="swap-amount-group-switch-icon" />
        </div>
      </div>
      <AmountCard
        title="You Receive"
        amount={swapInfo.valueOut}
        onAmountChange={setValueOut}
        amountUsd={amountOutUsd}
        amountUsdPercent={amountUsdPercent}
        token={swapInfo.tokenOut}
        onTokenChange={setTokenOut}
        isInput
      />
    </div>
  );
};

export default AmountCardGroup;
