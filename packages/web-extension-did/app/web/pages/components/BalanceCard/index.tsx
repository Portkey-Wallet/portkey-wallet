/* eslint-disable no-inline-styles/no-inline-styles */
import { useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

export interface BalanceCardProps {
  accountInfo?: any;
  amount?: string | number;
  isShowBuy?: boolean;
  isShowDeposit?: boolean;
  isShowDepositUSDT?: boolean;
  isShowWithdrawUSDT?: boolean;
  onBuy?: () => void;
  onSend?: () => void;
  onReceive?: () => void;
  onClickDeposit?: () => void;
  onClickDepositUSDT?: () => void;
  onClickWithdrawUSDT?: () => void;
}

export default function BalanceCard({
  onSend,
  onReceive,
  onClickDeposit,
  isShowBuy,
  isShowDeposit,
  isShowDepositUSDT,
  isShowWithdrawUSDT,
  onBuy,
  onClickDepositUSDT,
  onClickWithdrawUSDT,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const { isNotLessThan768 } = useCommonState();

  const renderBuy = useMemo(
    () =>
      !!isShowBuy && (
        <span className="send btn" onClick={onBuy}>
          <CustomSvg type="Buy" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Buy')}</span>
        </span>
      ),
    [isShowBuy, onBuy, t],
  );

  const renderDepositUSDT = useMemo(
    () =>
      !!isShowDepositUSDT && (
        <span className="send btn" onClick={onClickDepositUSDT}>
          <CustomSvg type="Deposit" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Deposit')}</span>
        </span>
      ),
    [isShowDepositUSDT, onClickDepositUSDT, t],
  );

  const renderWithdrawUSDT = useMemo(
    () =>
      !!isShowWithdrawUSDT && (
        <span className="send btn" onClick={onClickWithdrawUSDT}>
          <CustomSvg type="Withdraw" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Withdraw')}</span>
        </span>
      ),
    [isShowWithdrawUSDT, onClickWithdrawUSDT, t],
  );

  const renderDeposit = useMemo(() => {
    return (
      !!isShowDeposit && (
        <span className="deposit btn" onClick={onClickDeposit}>
          <CustomSvg type="Deposit" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Deposit')}</span>
        </span>
      )
    );
  }, [isShowDeposit, onClickDeposit, t]);

  const showCardNum = useMemo(
    () => (renderBuy ? 1 : 0) + (renderDeposit ? 1 : 0) + (renderDepositUSDT ? 1 : 0) + (renderWithdrawUSDT ? 1 : 0),
    [renderBuy, renderDeposit, renderDepositUSDT, renderWithdrawUSDT],
  );
  return (
    <div className="balance-card">
      <div className={clsx(['balance-btn', showCardNum > 1 && !isNotLessThan768 && 'popup-card-num-more-than-3'])}>
        {renderBuy}
        {renderDeposit}
        {renderDepositUSDT}
        {renderWithdrawUSDT}
        <span className="send btn" onClick={onSend}>
          <CustomSvg type="RightTop" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Send')}</span>
        </span>
        <span className="receive btn" onClick={onReceive}>
          <CustomSvg type="RightDown" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Receive')}</span>
        </span>
      </div>
    </div>
  );
}
