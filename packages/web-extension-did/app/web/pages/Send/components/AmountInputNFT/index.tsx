import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { Input } from 'antd';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import clsx from 'clsx';
import './index.less';

export default function NFTInput({
  token,
  amount,
  amountErrMsg,
  className,
  setAmountErrMsg,
  onChange,
}: {
  token: BaseToken;
  amount: string;
  amountErrMsg: string;
  className?: string;
  setAmountErrMsg: (v: string) => void;
  onChange: (amount: string) => void;
}) {
  return (
    <div className={clsx('input-nft-wrap', 'flex-column-center', className)}>
      <Input
        className={amountErrMsg ? 'amount-error' : ''}
        type="number"
        placeholder={`0`}
        value={amount}
        onChange={(e) => {
          const v = parseInputNumberChange(e.target.value, undefined, Number(token.decimals));
          setAmountErrMsg('');
          onChange(v);
        }}
      />
      {amountErrMsg && <span className="error-msg">{amountErrMsg}</span>}
    </div>
  );
}
