/* eslint-disable no-inline-styles/no-inline-styles */
import { useCallback, useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/wallet';
import './index.less';

export interface BalanceCardProps {
  accountInfo?: any;
  amount?: string | number;
  isShowFaucet?: boolean;
  isShowBuyEntry?: boolean;
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
  isShowBuyEntry,
  isShowFaucet,
  isShowDeposit,
  isShowDepositUSDT,
  isShowWithdrawUSDT,
  onBuy,
  onClickDepositUSDT,
  onClickWithdrawUSDT,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const { isNotLessThan768 } = useCommonState();

  const renderBuyEntry = useMemo(
    () =>
      !!isShowBuyEntry && (
        <span className="send btn" onClick={onBuy}>
          <CustomSvg type="BuyEntry" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Buy')}</span>
        </span>
      ),
    [isShowBuyEntry, onBuy, t],
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

  const handleClickFaucet = useCallback(() => {
    const openWinder = window.open(FAUCET_URL, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, []);

  const renderFaucet = useMemo(
    () =>
      isShowFaucet && (
        <span className="send btn" onClick={handleClickFaucet}>
          <CustomSvg type="Faucet" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Faucet')}</span>
        </span>
      ),
    [handleClickFaucet, isShowFaucet, t],
  );

  const showCardNum = useMemo(
    () =>
      2 + // Send + Receive
      (renderBuyEntry ? 1 : 0) +
      (renderDeposit ? 1 : 0) +
      (renderDepositUSDT ? 1 : 0) +
      (renderWithdrawUSDT ? 1 : 0) +
      (renderFaucet ? 1 : 0),
    [renderBuyEntry, renderDeposit, renderDepositUSDT, renderFaucet, renderWithdrawUSDT],
  );

  const cardNumClassName = useMemo(() => {
    if (isNotLessThan768) return 'prompt-card';
    if (showCardNum < 4) return 'popup-card-num-less-than-4';
    if (showCardNum === 4) return 'popup-card-num-4';
    return 'popup-card-num-more-than-4';
  }, [isNotLessThan768, showCardNum]);

  return (
    <div className={clsx(['balance-card', 'flex-center', cardNumClassName])}>
      {renderBuyEntry}
      {renderDeposit}
      <span className="send btn" onClick={onSend}>
        <CustomSvg type="RightTop" style={{ width: 36, height: 36 }} />
        <span className="btn-name">{t('Send')}</span>
      </span>
      <span className="receive btn" onClick={onReceive}>
        <CustomSvg type="RightDown" style={{ width: 36, height: 36 }} />
        <span className="btn-name">{t('Receive')}</span>
      </span>
      {renderDepositUSDT}
      {renderWithdrawUSDT}
      {renderFaucet}
    </div>
  );
}
