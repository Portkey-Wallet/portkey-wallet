import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { LimitType } from 'constants/security';
import { useNavigateState } from 'hooks/router';
import { CustomModalBottom } from 'pages/components/CustomModalBottom';
import ModalContent from 'pages/components/ModalContent';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TTransferSettingEditLocationState } from 'types/router';

export function useTransferLimitApprovalModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TTransferSettingEditLocationState>();

  return useCallback(
    (state: ITransferLimitRouteState, type: LimitType, onOneTimeApproval: () => void, isPrompt: boolean) => {
      const transferLimitModal = CustomModalBottom({
        type: 'confirm',
        noFooter: true,
        isPrompt,
        content: (
          <ModalContent
            title="Maximum transaction limit exceeded"
            content="Request one-time guardian approval to proceed, or modify the limit to lift restrictions on future transactions."
            buttonGroupType="col"
            buttons={[
              {
                content: t('Request one-time approval'),
                type: 'primary',
                onClick: () => {
                  transferLimitModal.destroy();
                  onOneTimeApproval();
                },
              },
              {
                content: t('Modify transfer limit for all'),
                type: 'default',
                onClick: () => {
                  transferLimitModal.destroy();
                  navigate('/setting/wallet-security/payment-security/transfer-settings-edit', {
                    state: { ...state, initStateBackUp: state, ...state.extra },
                  });
                },
              },
            ]}
          />
        ),
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
    (state: ITransferLimitRouteState, type: LimitType, isPrompt: boolean) => {
      const transferLimitModal = CustomModalBottom({
        type: 'confirm',
        noFooter: true,
        isPrompt,
        content: (
          <ModalContent
            title="Maximum transaction limit exceeded"
            content="Please modify the transfer limit to proceed."
            buttonGroupType="row"
            buttons={[
              {
                content: t('Cancel'),
                type: 'default',
                onClick: () => {
                  transferLimitModal.destroy();
                },
              },
              {
                content: t('Modify'),
                type: 'primary',
                onClick: () => {
                  transferLimitModal.destroy();
                  navigate('/setting/wallet-security/payment-security/transfer-settings-edit', {
                    state: { ...state, initStateBackUp: state, ...state.extra },
                  });
                },
              },
            ]}
          />
        ),
      });
      return transferLimitModal;
    },
    [navigate, t],
  );
}
