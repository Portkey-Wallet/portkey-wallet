import { IPaymentSecurityRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { Modal } from 'antd';
import { ExceedDailyLimit, ExceedSingleLimit } from 'constants/security';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function useSingleTransferLimitModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useCallback(
    (state: IPaymentSecurityRouteState) => {
      return Modal.confirm({
        width: 320,
        content: ExceedSingleLimit,
        className: 'cross-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t('Modify'),
        cancelText: t('Cancel'),
        onOk: () => navigate('/setting/wallet-security/payment-security/transfer-settings', { state }),
      });
    },
    [navigate, t],
  );
}

export function useDailyTransferLimitModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useCallback(
    (state: IPaymentSecurityRouteState) => {
      return Modal.confirm({
        width: 320,
        content: ExceedDailyLimit,
        className: 'cross-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t('Modify'),
        cancelText: t('Cancel'),
        onOk: () => navigate('/setting/wallet-security/payment-security/transfer-settings', { state }),
      });
    },
    [navigate, t],
  );
}
