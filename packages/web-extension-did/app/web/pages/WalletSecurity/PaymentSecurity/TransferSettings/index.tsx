import { useCommonState } from 'store/Provider/hooks';
import TransferSettingsPopup from './Popup';
import TransferSettingsPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';

export default function TransferSettings() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const headerTitle = t('Transfer Settings');

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/payment-security');
  }, [navigate]);

  return isNotLessThan768 ? (
    <TransferSettingsPrompt headerTitle={headerTitle} goBack={handleBack} />
  ) : (
    <TransferSettingsPopup headerTitle={headerTitle} goBack={handleBack} />
  );
}
