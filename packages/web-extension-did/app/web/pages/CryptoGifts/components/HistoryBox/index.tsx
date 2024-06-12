import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
import { CryptoGiftItem, CryptoGiftStatus } from '@portkey-wallet/types/types-ca/cryptogift';
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
  onClick,
}: IHistoryBoxProps) {
  const statusClassName = useMemo(() => {
    if (status === CryptoGiftStatus.Expired) return 'expired';
    if (status === CryptoGiftStatus.Claimed) return 'fully-claimed';
    if (status === CryptoGiftStatus.Active) return 'in-progress';
    return 'in-progress';
  }, [status]);
  return (
    <div className={clsx('history-box', 'history-container', 'flex', className)} onClick={() => onClick?.()}>
      <div className="history-container-left">
        <CustomSvg type="GiftIcon" />
      </div>
      <div className="history-container-right flex-1">
        <div className="gift-desc flex-between-center">
          <div className="gift-desc-text">{memo}</div>
          <div className={clsx('gift-desc-status', 'flex-center', statusClassName)}>{status}</div>
        </div>
        <div className="gift-date">{createTime}</div>
        <div className="gift-opened flex">
          <div className="gift-opened-label">Claimed:</div>
          <div className="gift-opened-content">{`${grabbedAmount} / ${totalAmount} ${symbol}`}</div>
        </div>
      </div>
    </div>
  );
}
