import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { Input } from 'antd';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import './index.less';
import clsx from 'clsx';

export default function NFTInput({
  token,
  amount,
  amountErrMsg,
  className,
  onChange,
}: {
  token: BaseToken;
  amount: string;
  amountErrMsg: string;
  className?: string;
  onChange: (amount: string) => void;
}) {
  return (
    <div className={clsx('input-nft-wrap', className)}>
      <Input
        type="number"
        placeholder={`0`}
        value={amount}
        // onBlur={handleAmountBlur}
        onChange={(e) => {
          const v = parseInputNumberChange(e.target.value, undefined, Number(token.decimals));
          onChange(v);
        }}
      />
      {amountErrMsg && <span className="error-msg">{amountErrMsg}</span>}
    </div>
  );
}
