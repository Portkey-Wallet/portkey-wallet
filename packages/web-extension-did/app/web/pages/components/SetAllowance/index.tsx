import { Input } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { isValidNumber } from '@portkey-wallet/utils/reg';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import ThrottleButton from 'components/ThrottleButton';
import { ALLOWANCE_HEADER_NO_NAME, SET_ALLOWANCE_MULTIPLY_TIP } from '@portkey-wallet/constants/constants-ca/allowance';
import { isNFT } from '@portkey-wallet/utils/token';
import { useGetContractUpgradeTime } from '@portkey-wallet/graphql/dappSecurity/hooks';
import CustomSvg, { SvgType } from 'components/CustomSvg';
import './index.less';
import { ChainId } from '@portkey-wallet/types';
import { getChain } from '@portkey/did-ui-react';
import { checkTimeOver12 } from '@portkey-wallet/utils/check';
import { formatDateTime } from '@portkey-wallet/utils/format';

export interface IBaseSetAllowanceProps {
  symbol: string;
  decimals?: number;
  amount: number | string;
  className?: string;
  max?: string | number;
  batchApproveNFT?: boolean;
  dappInfo?: { icon?: string; href?: string; name?: string };
  defaultIcon?: SvgType;
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
  defaultIcon,
  symbol,
  className,
  recommendedAmount = 0,
  originChainId,
  targetChainId,
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
  const getContractUpgradeTime = useGetContractUpgradeTime();
  const [contractUpgradeTimeResult, setContractUpgradeTimeResult] = useState<{
    isInit: boolean;
    isTimeOver12: boolean;
    formatTime: string;
  }>({
    isInit: true,
    isTimeOver12: true,
    formatTime: '',
  });
  useEffect(() => {
    (async () => {
      if (!originChainId || !targetChainId) {
        return;
      }
      const chainInfo = await getChain(originChainId);
      const result = await getContractUpgradeTime({
        input: {
          chainId: targetChainId,
          address: chainInfo.caContractAddress || '',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      console.log('wfs===result', result);
      const blockTime = result.data.contractList.items[0].metadata.block.blockTime;
      setContractUpgradeTimeResult({
        isInit: false,
        isTimeOver12: checkTimeOver12(blockTime),
        formatTime: formatDateTime(blockTime),
      });
    })();
  }, [getContractUpgradeTime, originChainId, targetChainId]);

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
        {dappInfo?.href || dappInfo?.icon ? (
          <div className="set-allowance-dapp-info-inner">
            {dappInfo.icon && <img className="set-allowance-dapp-icon" src={dappInfo.icon} />}
            {dappInfo.href && <span className="set-allowance-dapp-href">{dappInfo.href}</span>}
          </div>
        ) : defaultIcon ? (
          <CustomSvg type={defaultIcon} className="dapp-default-icon" />
        ) : null}
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
      {!contractUpgradeTimeResult.isInit && (
        <div
          className={`set-allowance-warning ${
            !contractUpgradeTimeResult.isTimeOver12 && `set-allowance-warning-hint`
          }`}>
          <CustomSvg
            type="WarningTriangle"
            className={`warning-icon`}
            fillColor={contractUpgradeTimeResult.isTimeOver12 ? '#5D42FF' : '#FF9417'}
          />
          <div className={'warning-title'}>{`Contract update time: ${
            contractUpgradeTimeResult?.formatTime || 'Oct 15, 2024, at 17:07'
          } The dApp's smart contract has been updated. Please proceed with caution.`}</div>
        </div>
      )}
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
