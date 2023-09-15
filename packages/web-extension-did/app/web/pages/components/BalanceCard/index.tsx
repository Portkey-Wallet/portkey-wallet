/* eslint-disable no-inline-styles/no-inline-styles */
import { useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
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
  const { isPrompt } = useCommonState();

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

  const showCardNum = useMemo(
    () => (renderBuy ? 1 : 0) + (renderFaucet ? 1 : 0) + (renderBridge ? 1 : 0),
    [renderBridge, renderBuy, renderFaucet],
  );

  return (
    <div className="balance-card">
      <div className={clsx(['balance-btn', showCardNum > 1 && !isPrompt && 'popup-card-num-more-than-3'])}>
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
