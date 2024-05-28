import { Input } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { isValidNumber } from '@portkey-wallet/utils/reg';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import ThrottleButton from 'components/ThrottleButton';
import { ALLOWANCE_HEADER_NO_NAME, SET_ALLOWANCE_MULTIPLY_TIP } from '@portkey-wallet/constants/constants-ca/allowance';
import { isNFT } from '@portkey-wallet/utils/token';
import './index.less';

export interface IBaseSetAllowanceProps {
  symbol: string;
  decimals?: number;
  amount: number | string;
  className?: string;
  max?: string | number;
  batchApproveNFT?: boolean;
  dappInfo?: { icon?: string; href?: string; name?: string };
}

export interface IAllowanceConfirmProps {
  allowance: string;
}

export interface ISetAllowanceHandlerProps {
  onCancel?: () => void;
  onConfirm?: (res: IAllowanceConfirmProps) => void;
  onAllowanceChange?: (amount: string) => void;
}

export type TSetAllowanceProps = IBaseSetAllowanceProps & {
  recommendedAmount?: string | number;
} & ISetAllowanceHandlerProps;

export default function SetAllowance({
  max = Infinity,
  amount,
  decimals,
  dappInfo,
  symbol,
  className,
  recommendedAmount = 0,
  onCancel,
  onAllowanceChange,
  onConfirm,
}: TSetAllowanceProps) {
  const formatAllowanceInput = useCallback(
    (value: number | string) =>
      parseInputNumberChange(value.toString(), max ? new BigNumber(max) : undefined, decimals),
    [decimals, max],
  );
  const approveSymbol = useMemo(() => (isNFT(symbol) ? symbol.split('-')[0] : symbol), [symbol]);

  const allowance = useMemo(() => formatAllowanceInput(amount), [amount, formatAllowanceInput]);

  const [error, setError] = useState<string>('');

  const inputChange = useCallback(
    (amount: string | number) => {
      if (isValidNumber(`${amount}`)) {
        onAllowanceChange?.(formatAllowanceInput(amount));
      } else if (!amount) {
        onAllowanceChange?.('');
      }
      setError('');
    },
    [formatAllowanceInput, onAllowanceChange],
  );

  return (
    <div className={clsx('set-allowance-page-wrapper', className)}>
      <div className="flex-center set-allowance-dapp-info">
        {(dappInfo?.href || dappInfo?.icon) && (
          <div className="set-allowance-dapp-info-inner">
            {dappInfo.icon && <img className="set-allowance-dapp-icon" src={dappInfo.icon} />}
            {dappInfo.href && <span className="set-allowance-dapp-href">{dappInfo.href}</span>}
          </div>
        )}
      </div>
      <div className="set-allowance-header flex-column">
        <div className="text-center set-allowance-title">
          {dappInfo?.name
            ? `${dappInfo?.name} is requesting access to your ${approveSymbol}`
            : ALLOWANCE_HEADER_NO_NAME}
        </div>
        <div className="text-center set-allowance-description">
          To ensure asset security, please customise an allowance for this dApp. Until this allowance is exhausted, the
          dApp will not request your approval to utilise&nbsp;{approveSymbol}
        </div>
      </div>

      <div className="set-allowance-body">
        <div className="flex-between-center set-allowance-body-title">
          <span className="set-allowance-set">{`Set Allowance`}</span>
          <span className="set-allowance-use-recommended" onClick={() => inputChange(recommendedAmount)}>
            Use Recommended Value
          </span>
        </div>
        <div className="set-allowance-input-wrapper">
          <Input
            value={allowance}
            onChange={(e) => {
              inputChange(e.target.value);
            }}
            suffix={
              <span>
                <span className={`set-allowance-approve-symbol`}>{approveSymbol}</span>
                <span onClick={() => inputChange(max)}>Max</span>
              </span>
            }
          />

          {typeof error !== 'undefined' && <div className="error-text">{error}</div>}
        </div>

        <div className="set-allowance-notice">{SET_ALLOWANCE_MULTIPLY_TIP}</div>
      </div>
      <div className="set-allowance-btn-wrapper flex-row-between">
        <ThrottleButton onClick={onCancel}>Reject</ThrottleButton>
        <ThrottleButton
          type="primary"
          disabled={BigNumber(allowance).isNaN()}
          onClick={() => {
            if (!isValidNumber(allowance)) return setError('Please enter a positive whole number');
            if (BigNumber(allowance).lte(0)) return setError('Please enter a non-zero value');
            onConfirm?.({ allowance });
          }}>
          Pre-authorize
        </ThrottleButton>
      </div>
    </div>
  );
}
