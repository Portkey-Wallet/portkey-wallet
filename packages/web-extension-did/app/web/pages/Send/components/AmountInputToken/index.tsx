import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { Input } from 'antd';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import clsx from 'clsx';
import { useState } from 'react';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import './index.less';

export default function TokenInput({
  token,
  amount,
  usdAmount,
  amountErrMsg,
  className,
  onAmountChange,
  onUsdAmountChange,
}: {
  token: BaseToken;
  amount: string;
  usdAmount: string;
  amountErrMsg: string;
  className?: string;
  onAmountChange: (amount: string) => void;
  onUsdAmountChange: (amount: string) => void;
}) {
  const [revert, setRevert] = useState(true);
  const isMainnet = useIsMainnet();
  return (
    <div className={clsx('input-token-wrap', className)}>
      {revert ? (
        <>
          <Input
            type="number"
            placeholder={`0`}
            value={amount}
            // onBlur={handleAmountBlur}
            onChange={(e) => {
              const v = parseInputNumberChange(e.target.value, undefined, Number(token.decimals));
              onAmountChange(v);
            }}
          />
          <div>{token.label || token.symbol}</div>
        </>
      ) : (
        <>
          <div>{`$ `}</div>
          <Input
            type="number"
            placeholder={`0`}
            value={usdAmount}
            // onBlur={handleAmountBlur}
            onChange={(e) => {
              const v = parseInputNumberChange(e.target.value, undefined, Number(token.decimals));
              onUsdAmountChange(v);
            }}
          />
        </>
      )}
      {isMainnet ? (
        <>
          {revert ? <div>{usdAmount}</div> : <div>{`${amount} ${token.label || token.symbol}`}</div>}
          <CustomSvgV3 type="swap_vert thin" onClick={() => setRevert(!revert)} />
        </>
      ) : null}
      {amountErrMsg && <span className="error-msg">{amountErrMsg}</span>}
    </div>
  );
}
