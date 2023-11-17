import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { ExceedDailyLimit, ExceedSingleLimit } from 'constants/security';
import { useGuardiansNavigate } from 'hooks/guardians';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function useSingleTransferLimitModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const guardiansNavigate = useGuardiansNavigate();

  return useCallback(
    (state: ITransferLimitRouteState) => {
      const transferLimitModal = CustomModal({
        type: 'confirm',
        content: (
          <div>
            <div className="flex-center close-icon" onClick={() => transferLimitModal.destroy()}>
              <CustomSvg type="Close2" />
            </div>

            <span>{ExceedSingleLimit}</span>
          </div>
        ),
        className: 'transfer-limit-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t(`Request One-Time Approval`),
        cancelText: t('Modify Transfer Limit for All'),
        onOk: () => guardiansNavigate({ ...state, initStateBackUp: state }),
        onCancel: () =>
          navigate('/setting/wallet-security/payment-security/transfer-settings-edit', {
            state: { ...state, initStateBackUp: state },
          }),
      });
      return transferLimitModal;
    },
    [guardiansNavigate, navigate, t],
  );
}

export function useDailyTransferLimitModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useCallback(
    (state: ITransferLimitRouteState) => {
      return Modal.confirm({
        width: 320,
        content: ExceedDailyLimit,
        className: 'cross-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t('Modify'),
        cancelText: t('Cancel'),
        onOk: () =>
          navigate('/setting/wallet-security/payment-security/transfer-settings-edit', {
            state: { ...state, initStateBackUp: state },
          }),
      });
    },
    [navigate, t],
  );
}
