import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import {
  ApproveExceedDailyLimit,
  ApproveExceedSingleLimit,
  ExceedDailyLimit,
  ExceedSingleLimit,
  LimitType,
} from 'constants/security';
import { useNavigateState } from 'hooks/router';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TTransferSettingEditLocationState } from 'types/router';

export function useTransferLimitApprovalModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TTransferSettingEditLocationState>();

  return useCallback(
    (state: ITransferLimitRouteState, type: LimitType, onOneTimeApproval: () => void) => {
      const transferLimitModal = CustomModal({
        type: 'confirm',
        content: (
          <div>
            <div className="flex-center close-icon" onClick={() => transferLimitModal.destroy()}>
              <CustomSvg type="SuggestClose" />
            </div>

            <span>{type === LimitType.Daily ? ApproveExceedDailyLimit : ApproveExceedSingleLimit}</span>
          </div>
        ),
        className: 'transfer-limit-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t(`Request One-Time Approval`),
        cancelText: t('Modify Transfer Limit for All'),
        onOk: onOneTimeApproval,
        onCancel: () =>
          navigate('/setting/wallet-security/payment-security/transfer-settings-edit', {
            state: { ...state, initStateBackUp: state, ...state.extra },
          }),
      });
      return transferLimitModal;
    },
    [navigate, t],
  );
}

export function useTransferLimitModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TTransferSettingEditLocationState>();

  return useCallback(
    (state: ITransferLimitRouteState, type: LimitType) => {
      return Modal.confirm({
        width: 320,
        content: type === LimitType.Daily ? ExceedDailyLimit : ExceedSingleLimit,
        className: 'cross-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t('Modify'),
        cancelText: t('Cancel'),
        onOk: () =>
          navigate('/setting/wallet-security/payment-security/transfer-settings-edit', {
            state: { ...state, initStateBackUp: state, ...state.extra },
          }),
      });
    },
    [navigate, t],
  );
}
