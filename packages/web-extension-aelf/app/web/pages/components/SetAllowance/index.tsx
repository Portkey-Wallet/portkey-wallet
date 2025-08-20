import { Input } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { isValidNumber } from '@portkey-wallet/utils/reg';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import ThrottleButton from 'components/ThrottleButton';
import { isNFT } from '@portkey-wallet/utils/token';
import { SvgType } from 'components/CustomSvg';
import './index.less';
import { ChainId } from '@portkey-wallet/types';
import { useDappSpenderCheck } from '@portkey-wallet/hooks/hooks-ca/discover';
import { DappSiteInfo } from '../DappSiteInfo';
import { CommonModalTip, CommonPromptCard } from '@portkey/did-ui-react';
import { PromptCardType } from 'pages/Send';
import { CustomSvgV3 } from 'components/CustomSvgV3';

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
  // defaultIcon,
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
          <CommonModalTip
            title="Token allowance"
            content={`For asset security, set a custom allowance for this dApp. ${approveSymbol} approval won't be needed until the allowance is used up. You can change the settings anytime.`}
          />
        </div>

        <Input
          className={clsx(error !== '' && 'set-allowance-input-error')}
          value={allowance}
          onChange={(e) => {
            inputChange(e.target.value);
          }}
          allowClear={{
            clearIcon: <CustomSvgV3 className="set-allowance-input-clear-icon" type="close-circle" />,
          }}
          suffix={<span className={`set-allowance-approve-symbol`}>{approveSymbol}</span>}
        />

        {error !== '' && <div className="set-allowance-error-text">{error}</div>}

        <div className="set-allowance-action">
          <div className="set-allowance-action-button" onClick={() => inputChange(recommendedAmount)}>
            Use default
          </div>
          <div className="set-allowance-action-button" onClick={() => inputChange(max)}>
            Max
          </div>
        </div>
      </div>

      <div className="set-allowance-page-footer">
        {/* TODO-SA */}
        {checkResult.show && (
          <CommonPromptCard
            className="set-allowance-tip"
            type={isTipWarning ? PromptCardType.WARNING : PromptCardType.INFO}
            description={
              <div
                className="warning-title"
                dangerouslySetInnerHTML={{
                  __html: checkResult.text.replace(/\n/g, '<br/>'),
                }}
              />
            }
          />
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
            {/*Pre-authorize*/}
            Authorize
          </ThrottleButton>
        </div>
        <div className="set-allowance-footer-tip">{'Only approve if you trust this website'}</div>
      </div>
    </div>
  );
}
