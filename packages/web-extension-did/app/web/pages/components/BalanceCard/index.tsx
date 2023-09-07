/* eslint-disable no-inline-styles/no-inline-styles */
import { useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';

export interface BalanceCardProps {
  accountInfo?: any;
  amount?: string | number;
  onSend?: () => void;
  onReceive?: () => void;
  onBuy?: () => void;
  isShowBuy?: boolean;
  isShowBridge?: boolean;
  onClickBridge?: () => void;
}

export default function BalanceCard({
  onSend,
  onReceive,
  onBuy,
  isShowBuy,
  isShowBridge,
  onClickBridge,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const isMainNet = useIsMainnet();

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

  const renderFaucet = useMemo(
    () =>
      !isMainNet && (
        <span className="send btn" onClick={onBuy}>
          <CustomSvg type="Faucet" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Faucet')}</span>
        </span>
      ),
    [isMainNet, onBuy, t],
  );

  const renderBridge = useMemo(
    () =>
      isShowBridge && (
        <span className="send btn" onClick={onClickBridge}>
          <CustomSvg type="Bridge" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Bridge')}</span>
        </span>
      ),
    [isShowBridge, onClickBridge, t],
  );

  return (
    <div className="balance-card">
      <div className="balance-btn">
        {renderBuy}
        {renderBridge}
        <span className="send btn" onClick={onSend}>
          <CustomSvg type="RightTop" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Send')}</span>
        </span>
        <span className="receive btn" onClick={onReceive}>
          <CustomSvg type="RightDown" style={{ width: 36, height: 36 }} />
          <span className="btn-name">{t('Receive')}</span>
        </span>
        {renderFaucet}
      </div>
    </div>
  );
}
