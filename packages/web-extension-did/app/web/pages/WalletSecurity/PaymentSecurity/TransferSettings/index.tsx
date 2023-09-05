import { useCommonState } from 'store/Provider/hooks';
import TransferSettingsPopup from './Popup';
import TransferSettingsPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useCallback } from 'react';

export default function TransferSettings() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const headerTitle = t('Transfer Settings');

  // TODO from
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/payment-security');
  }, [navigate]);

  // TODO from
  const onEdit = useCallback(() => {
    navigate('/setting/wallet-security/payment-security/transfer-settings-edit', { state: state });
  }, [navigate, state]);

  return isNotLessThan768 ? (
    <TransferSettingsPrompt headerTitle={headerTitle} goBack={handleBack} state={state} onEdit={onEdit} />
  ) : (
    <TransferSettingsPopup headerTitle={headerTitle} goBack={handleBack} state={state} onEdit={onEdit} />
  );
}
