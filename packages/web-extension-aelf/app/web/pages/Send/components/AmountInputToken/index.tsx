import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { Input } from 'antd';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ZERO } from '@portkey-wallet/constants/misc';
import './index.less';

export default function TokenInput({
  token,
  amount,
  usdAmount,
  amountErrMsg,
  className,
  setAmountErrMsg,
  onAmountChange,
  onUsdAmountChange,
}: {
  token: BaseToken;
  amount: string;
  usdAmount: string;
  amountErrMsg: string;
  className?: string;
  setAmountErrMsg: (v: string) => void;
  onAmountChange: (amount: string) => void;
  onUsdAmountChange: (amount: string) => void;
}) {
  const [revert, setRevert] = useState(true);
  const isMainnet = useIsMainnet();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();

  const onValueInputChange = useCallback(
    (v: string) => {
      const _v = parseInputNumberChange(v, Infinity, Number(token.decimals));
      const _usdV = ZERO.plus(_v || 0)
        .multipliedBy(tokenPriceObject[token.symbol])
        .toFixed(2);
      onUsdAmountChange(_usdV);
      onAmountChange(_v);
    },
    [onAmountChange, onUsdAmountChange, token.decimals, token.symbol, tokenPriceObject],
  );
  const onUsdValueInputChange = useCallback(
    (v: string) => {
      const _usdV = parseInputNumberChange(v, Infinity, 2);
      const _v = parseInputNumberChange(
        ZERO.plus(_usdV || 0)
          .div(tokenPriceObject[token.symbol])
          .valueOf(),
        Infinity,
        Number(token.decimals),
      );
      onUsdAmountChange(_usdV);
      onAmountChange(_v);
    },
    [onAmountChange, onUsdAmountChange, token.decimals, token.symbol, tokenPriceObject],
  );

  const existTokenPrice = useMemo(() => {
    return tokenPriceObject[token.symbol] !== 0;
  }, [tokenPriceObject, token.symbol]);

  const amountLength = useMemo(() => {
    if (amount.length > 18) return 'font20';
    if (amount.length > 12) return 'font24';
    return '';
  }, [amount.length]);

  return (
    <div className={clsx('input-token-wrap', 'flex-column-center', className)}>
      {revert ? (
        <div className="flex">
          <Input
            type="number"
            placeholder={`0`}
            value={amount}
            onChange={(e) => {
              setAmountErrMsg('');
              onValueInputChange(e.target.value);
            }}
            className={clsx('amount-input', amountLength, amountErrMsg && 'amount-error')}
            style={{ width: `${amount.length || 1}ch` }}
          />
          <span className={clsx('amount-input-suffix', amountLength)}>{token.label || token.symbol}</span>
        </div>
      ) : (
        <div>
          <span className="amount-input-suffix">{`$ `}</span>
          <Input
            type="number"
            placeholder={`0`}
            className={clsx('amount-input', 'usd-input', amountErrMsg && 'amount-error')}
            value={usdAmount}
            style={{ width: `${usdAmount.length || 1}ch` }}
            onChange={(e) => {
              setAmountErrMsg('');
              onUsdValueInputChange(e.target.value);
            }}
          />
        </div>
      )}
      {isMainnet && existTokenPrice ? (
        <div className="swap-vert flex-row-center">
          {revert ? (
            <div>{usdAmount ? `$${usdAmount}` : `$0`}</div>
          ) : (
            <div>{`${amount} ${token.label || token.symbol}`}</div>
          )}
          <CustomSvgV3
            fillColor="#FFFFFFB2"
            type="swap_vert thin"
            className="swap-vert-thin-icon cursor-pointer"
            onClick={() => setRevert(!revert)}
          />
        </div>
      ) : null}
      {amountErrMsg && <span className="error-msg">{amountErrMsg}</span>}
    </div>
  );
}
