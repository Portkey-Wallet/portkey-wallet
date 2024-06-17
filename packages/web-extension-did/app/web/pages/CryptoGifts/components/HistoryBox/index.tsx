import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import { CryptoGiftItem, CryptoGiftOriginalStatus } from '@portkey-wallet/types/types-ca/cryptogift';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import './index.less';

export interface IHistoryBoxProps extends CryptoGiftItem {
  className?: string;
  onClick?: () => void;
}

export default function HistoryBox({
  className,
  memo,
  status,
  createTime,
  grabbedAmount,
  totalAmount,
  symbol,
  displayStatus,
  decimals,
  alias,
  label,
  onClick,
}: IHistoryBoxProps) {
  const statusClassName = useMemo(() => {
    if (
      [CryptoGiftOriginalStatus.Init, CryptoGiftOriginalStatus.NotClaimed, CryptoGiftOriginalStatus.Claimed].includes(
        status,
      )
    )
      return 'in-progress';
    if (status === CryptoGiftOriginalStatus.FullyClaimed) return 'fully-claimed';
    return 'expired';
  }, [status]);
  return (
    <div className={clsx('history-box', 'history-container', 'flex', className)} onClick={() => onClick?.()}>
      <div className="history-container-left">
        <CustomSvg type="GiftIcon" />
      </div>
      <div className="history-container-right flex-1">
        <div className="gift-desc flex-between-center">
          <div className="gift-desc-text">{memo}</div>
          <div className={clsx('gift-desc-status', 'flex-center', statusClassName)}>{displayStatus}</div>
        </div>
        <div className="gift-date">{formatTransferTime(createTime || 1)}</div>
        <div className="gift-opened flex">
          <div className="gift-opened-label">Claimed:</div>
          <div className="gift-opened-content">{`${formatTokenAmountShowWithDecimals(
            grabbedAmount,
            decimals,
          )} / ${formatTokenAmountShowWithDecimals(totalAmount, decimals)} ${label || alias || symbol}`}</div>
        </div>
      </div>
    </div>
  );
}
