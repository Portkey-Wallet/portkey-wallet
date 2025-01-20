import clsx from 'clsx';
import './index.less';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo } from 'react';

export type TCurrencyItemProps = {
  className?: string;
  isChainNameShow?: boolean;
  item: TCurrency;
  balance?: string;
  balanceInUsd?: string;
  onClick?: (item: TCurrency) => void;
};
export const CurrencyItem = ({
  item,
  onClick,
  className,
  isChainNameShow = true,
  balance,
  balanceInUsd,
}: TCurrencyItemProps) => {
  const isMainnet = useIsMainnet();

  const onPress = useCallback(() => {
    onClick?.(item);
  }, [item, onClick]);

  const balanceInUsdText = useMemo(() => {
    if (balanceInUsd) return balanceInUsd;
    return `$${Number(balanceInUsd ?? item.balanceInUsd ?? 0).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    })}`;
  }, [balanceInUsd, item.balanceInUsd]);

  return (
    <div className={clsx('currency-item-wrap', className)} onClick={onPress}>
      <div className="currency-item-token-image-wrap">
        <TokenImageDisplay width={40} symbol={item?.symbol} src={item?.imageUrl} />
        <TokenImageDisplay
          className="currency-item-chain-image"
          width={20}
          symbol={item?.displayChainName}
          src={item?.chainImageUrl}
        />
      </div>

      <div className="currency-item-body">
        <div className="currency-item-title">{formatNameWithNoUnderline(item.label || item.symbol)}</div>

        {isChainNameShow && item.displayChainName && (
          <div className="currency-item-sub-title">{item.displayChainName}</div>
        )}
      </div>

      <div className="currency-item-suffix">
        <div className="currency-item-title">
          {balance ?? formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
        </div>

        {isMainnet && item.balanceInUsd && <div className="currency-item-sub-title">{balanceInUsdText}</div>}
      </div>
    </div>
  );
};
