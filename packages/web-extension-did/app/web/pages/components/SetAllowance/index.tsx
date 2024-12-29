import { Button, Input, Tooltip } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { isValidNumber } from '@portkey-wallet/utils/reg';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import ThrottleButton from 'components/ThrottleButton';
import { ALLOWANCE_HEADER_NO_NAME, SET_ALLOWANCE_MULTIPLY_TIP } from '@portkey-wallet/constants/constants-ca/allowance';
import { isNFT } from '@portkey-wallet/utils/token';
import CustomSvg, { SvgType } from 'components/CustomSvg';
import './index.less';
import { ChainId } from '@portkey-wallet/types';
import { useDappSpenderCheck } from '@portkey-wallet/hooks/hooks-ca/discover';
import { DappSiteInfo } from '../DappSiteInfo';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { CommonTooltip } from '@portkey/did-ui-react';

export interface IBaseSetAllowanceProps {
  symbol: string;
  decimals?: number;
  amount: number | string;
  className?: string;
  max?: string | number;
  batchApproveNFT?: boolean;
  dappInfo?: { icon?: string; href?: string; name?: string };
  defaultIcon?: SvgType;
  spender?: string;
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
  originChainId?: ChainId;
  targetChainId?: ChainId;
} & ISetAllowanceHandlerProps;

export default function SetAllowance({
  max = Infinity,
  amount,
  decimals,
  dappInfo,
  // TODO: revamp defaultIcon
  defaultIcon,
  symbol,
  className,
  recommendedAmount = 0,
  // originChainId,
  targetChainId,
  spender,
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

  // TODO: revamp error
  const [error, setError] = useState<string>('');
  const checkResult = useDappSpenderCheck(dappInfo?.href, spender, dappInfo?.icon, targetChainId);

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

  const isTipWarning = useMemo(() => checkResult.type === 'warning', [checkResult.type]);

  return (
    <div className={clsx('set-allowance-page-wrapper', className)}>
      <div className="set-allowance-page-body">
        <DappSiteInfo title="Approve token allowance" dappInfo={dappInfo} />

        <div className="set-allowance-title-wrap">
          <span className="set-allowance-title">Token allowance</span>
          <CommonTooltip title={SET_ALLOWANCE_MULTIPLY_TIP} placement="bottom">
            <CustomSvgV3 type="help" className="set-allowance-title-icon" />
          </CommonTooltip>
        </div>

        <Input
          value={allowance}
          onChange={(e) => {
            inputChange(e.target.value);
          }}
          // TODO: revamp allowClear
          // allowClear
          suffix={<span className={`set-allowance-approve-symbol`}>{approveSymbol}</span>}
        />

        <div className="set-allowance-action">
          <div className="set-allowance-action-button" onClick={() => inputChange(recommendedAmount)}>
            Use default
          </div>
          <div className="set-allowance-action-button" onClick={() => inputChange(max)}>
            Max
          </div>
        </div>
      </div>

      {/* {typeof error !== 'undefined' && <div className="error-text">{error}</div>} */}
      <div className="set-allowance-page-footer">
        {checkResult.show && (
          <div className={clsx('set-allowance-tip', isTipWarning && 'set-allowance-tip-hint')}>
            <CustomSvgV3 type={isTipWarning ? 'error' : 'info'} className="warning-icon" />
            <div
              className="warning-title"
              dangerouslySetInnerHTML={{
                __html: checkResult.text.replace(/\n/g, '<br/>'),
              }}
            />
          </div>
        )}
        <div className="set-allowance-btn-wrapper">
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

        <div className="set-allowance-footer-tip">{'Only approve if you trust this website'}</div>
      </div>
    </div>
  );
}
