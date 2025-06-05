import React, { ReactNode, useCallback, useMemo } from 'react';

import { useAwakenGasFee } from '@portkey-wallet/hooks/hooks-eoa/awaken/state';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals } from '@portkey-wallet/utils/converter';
import Bignumber from 'bignumber.js';
import { TCurrency } from '@portkey-wallet/types/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { isValidNumberV2 } from '@portkey-wallet/utils/reg';
import { parseInputChange } from '@portkey-wallet/utils/input';
import { LIMIT_PRICE_DECIMAL } from '@portkey-wallet/constants/awaken/limit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { Button, Input } from 'antd';
import './index.less';
import { singleMessage } from '@portkey/did-ui-react';
import clsx from 'clsx';
import { SelectTokenButton } from '../SelectTokenButton';

interface IAmountCardProps {
  className?: string;
  title: string;
  isInput?: boolean;
  isError?: boolean;
  amount?: string;
  amountUsd?: ReactNode;
  amountUsdPercent?: ReactNode;
  isAmountUsdPercentPositive?: boolean;
  balance?: Bignumber;
  onAmountChange?: (value: string) => void;
  token?: TCurrency;
  onTokenChange?: (token: TCurrency) => void;
  isMaxShow?: boolean;
}

export const AmountCard = ({
  className,
  title,
  isInput = false,
  isError = false,
  amount,
  amountUsd,
  amountUsdPercent,
  balance,
  onAmountChange,
  token,
  onTokenChange,
  isMaxShow = false,
}: IAmountCardProps) => {
  const isMainnet = useIsMainnet();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !isValidNumberV2(value)) {
      return;
    }
    const newValue = parseInputChange(value, ZERO, token?.decimals || LIMIT_PRICE_DECIMAL);
    onAmountChange?.(newValue);
  };

  const gasFee = useAwakenGasFee();
  const handleMaxPress = useCallback(() => {
    if (balance?.isNaN() || !balance || !token) {
      onAmountChange?.('');
      return;
    }
    const { symbol, decimals } = token;
    if (symbol === 'ELF' && gasFee && balance) {
      const _valueBN = ZERO.plus(balance).minus(gasFee);
      if (_valueBN.lte(ZERO)) {
        onAmountChange?.('');
        singleMessage.error('Insufficient balance to cover gas fee.');
        return;
      }
      onAmountChange?.(divDecimals(_valueBN, decimals).toFixed() || '');
      return;
    }
    if (ZERO.gte(balance)) {
      onAmountChange?.('');
      return;
    }
    onAmountChange?.(divDecimals(balance || ZERO, decimals).toFixed() || '');
  }, [balance, gasFee, onAmountChange, token]);

  const balanceStr = useMemo(() => {
    if (!balance || balance.isNaN() || !token) {
      return '';
    }
    const { symbol, decimals } = token;
    return `${divDecimals(balance, decimals).toFixed()} ${formatNameWithNoUnderline(symbol)}`;
  }, [balance, token]);

  return (
    <div className={clsx('swap-amount-card', className)}>
      <div className="swap-amount-title">{title}</div>
      <div className="swap-amount-wrap">
        <Input
          className={clsx('swap-amount-input', isError && 'swap-amount-input-error')}
          maxLength={18}
          disabled={!isInput}
          placeholder="0"
          value={amount}
          onChange={handleAmountChange}
        />

        <SelectTokenButton modalTitle={title} token={token} onTokenChange={onTokenChange} />
      </div>
      <div className="swap-amount-info">
        <div className="swap-amount-usd-amount-wrap">
          {isMainnet && (
            <>
              <div className="swap-amount-usd-amount">{amountUsd}</div>
              {amountUsdPercent}
            </>
          )}
        </div>
        {isInput && isMaxShow && (
          <div className="swap-amount-balance-wrap">
            <span className="swap-amount-balance-amount">{balanceStr}</span>
            <Button className="swap-amount-balance-max-button" type="default" onClick={handleMaxPress}>
              Max
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
