import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const useCheckSecurity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // TODO check

  return useCallback(() => {
    return CustomModal({
      type: 'confirm',
      content: (
        <div>
          <div className="modal-title">{t('Low wallet security level')}</div>
          <div>{t('Please promptly increase the security level of your wallet and add the number of guardians')}</div>
        </div>
      ),
      cancelText: t('Not Now'),
      okText: t('Add Guardians'),
      onOk: () => navigate('/setting/guardians'),
    });
  }, [navigate, t]);
};
