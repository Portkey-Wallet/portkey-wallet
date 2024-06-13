import { useCallback, useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/wallet';
import './index.less';

export interface MainCardsProps {
  className?: string;
  isShowFaucet?: boolean;
  onSend?: () => void;
  onReceive?: () => void;
  onBuy?: () => void;
  onClickSwap?: () => void;
  onClickDeposit?: () => void;
}

export default function MainCards({
  className,
  isShowFaucet,
  onSend,
  onReceive,
  onBuy,
  onClickSwap,
  onClickDeposit,
}: MainCardsProps) {
  const { t } = useTranslation();
  const { isNotLessThan768 } = useCommonState();

  const renderSend = useMemo(
    () =>
      !!onSend && (
        <div className="card-item send-card flex-column-center" onClick={onSend}>
          <CustomSvg type="DirectionArrow" className="flex-center" />
          <span className="btn-name">{t('Send')}</span>
        </div>
      ),
    [onSend, t],
  );

  const renderReceive = useMemo(
    () =>
      !!onReceive && (
        <div className="card-item receive-card flex-column-center" onClick={onReceive}>
          <CustomSvg type="DirectionArrow" className="flex-center" />
          <span className="btn-name">{t('Receive')}</span>
        </div>
      ),
    [onReceive, t],
  );

  const renderBuy = useMemo(
    () =>
      !!onBuy && (
        <div className="buy-card card-item flex-column-center" onClick={onBuy}>
          <CustomSvg type="Addition" className="flex-center" />
          <span className="btn-name">{t('Buy')}</span>
        </div>
      ),
    [onBuy, t],
  );

  const renderDeposit = useMemo(() => {
    return (
      !!onClickDeposit && (
        <div className="deposit-card card-item flex-column-center" onClick={onClickDeposit}>
          <CustomSvg type="Deposit" className="flex-center" />
          <span className="btn-name">{t('Deposit')}</span>
        </div>
      )
    );
  }, [onClickDeposit, t]);

  const renderSwap = useMemo(() => {
    return (
      !!onClickSwap && (
        <div className="swap-card card-item flex-column-center" onClick={onClickSwap}>
          <CustomSvg type="Swap" className="flex-center" />
          <span className="btn-name">{t('Swap')}</span>
        </div>
      )
    );
  }, [onClickSwap, t]);

  const handleClickFaucet = useCallback(() => {
    const openWinder = window.open(FAUCET_URL, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, []);

  const renderFaucet = useMemo(
    () =>
      isShowFaucet && (
        <div className="faucet-card card-item flex-column-center" onClick={handleClickFaucet}>
          <CustomSvg type="Faucet" className="flex-center" />
          <span className="btn-name">{t('Faucet')}</span>
        </div>
      ),
    [handleClickFaucet, isShowFaucet, t],
  );

  const showCardNum = useMemo(
    () =>
      (renderSend ? 1 : 0) +
      (renderReceive ? 1 : 0) +
      (renderBuy ? 1 : 0) +
      (renderSwap ? 1 : 0) +
      (renderDeposit ? 1 : 0) +
      (renderFaucet ? 1 : 0),
    [renderBuy, renderDeposit, renderFaucet, renderReceive, renderSend, renderSwap],
  );

  const cardNumClassName = useMemo(() => {
    if (isNotLessThan768) return 'prompt-card';
    if (showCardNum < 5) return 'popup-card-num-less-than-5';
    return 'popup-card-num-more-than-or-equal-5';
  }, [isNotLessThan768, showCardNum]);

  return (
    <div className={clsx('main-card-list-wrap flex-center', className, cardNumClassName)}>
      {renderSend}
      {renderReceive}
      {renderBuy}
      {renderSwap}
      {renderDeposit}
      {renderFaucet}
    </div>
  );
}
