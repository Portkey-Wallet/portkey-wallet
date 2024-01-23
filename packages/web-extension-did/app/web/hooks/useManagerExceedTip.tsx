import { managerExceedTipModalTitle, managerExceedTipModalContent } from 'constants/managerExceed';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateState } from './router';
import { useCheckManagerExceed } from '@portkey-wallet/hooks/hooks-ca/wallet';

export function useManagerExceedTipModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const checkManagerExceedStatus = useCheckManagerExceed();

  const showManagerExceedTip = useCallback(async () => {
    try {
      const status = await checkManagerExceedStatus();
      return status;
    } catch (error) {
      console.log('===checkManagerExceedStatus error', error);
      return false;
    }
  }, [checkManagerExceedStatus]);

  const toDelete = useCallback(() => {
    navigate('/setting/wallet-security/manage-devices');
  }, [navigate]);

  return useCallback(async () => {
    const status = await showManagerExceedTip();
    if (status) {
      CustomModal({
        className: 'manager-exceed-tip-modal',
        type: 'confirm',
        content: (
          <div className="manager-exceed-tip-modal-container">
            <div className="modal-title">{managerExceedTipModalTitle}</div>
            <div className="modal-content flex-column">{managerExceedTipModalContent}</div>
          </div>
        ),
        cancelText: t('Cancel'),
        okText: t('Go to Delete'),
        onOk: toDelete,
      });
    }
  }, [showManagerExceedTip, t, toDelete]);
}
