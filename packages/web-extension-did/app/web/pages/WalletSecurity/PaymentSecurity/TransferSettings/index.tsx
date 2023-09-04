import { useCommonState } from 'store/Provider/hooks';
import TransferSettingsPopup from './Popup';
import TransferSettingsPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useState } from 'react';
import { ValidData } from 'pages/Contacts/AddContact';

export default function TransferSettings() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const headerTitle = t('Transfer Settings');
  const [disable, setDisable] = useState(true);
  const [validSingleLimit, setValidSingleLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validDailyLimit, setValidDailyLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/payment-security');
  }, [navigate]);

  const handleSingleLimitChange = useCallback((v: string) => {
    console.log('🌈 🌈 🌈 🌈 🌈 🌈 v', v);
  }, []);

  const handleDailyLimitChange = useCallback((v: string) => {
    console.log('🌈 🌈 🌈 🌈 🌈 🌈 v', v);
  }, []);

  const onFinish = useCallback(() => {
    console.log('🌈 🌈 🌈 🌈 🌈 🌈 finish');
  }, []);

  return isNotLessThan768 ? (
    <TransferSettingsPrompt
      headerTitle={headerTitle}
      goBack={handleBack}
      state={state}
      disable={disable}
      validSingleLimit={validSingleLimit}
      validDailyLimit={validDailyLimit}
      onSingleLimitChange={handleSingleLimitChange}
      onDailyLimitChange={handleDailyLimitChange}
      onFinish={onFinish}
    />
  ) : (
    <TransferSettingsPopup
      headerTitle={headerTitle}
      goBack={handleBack}
      state={state}
      disable={disable}
      validSingleLimit={validSingleLimit}
      validDailyLimit={validDailyLimit}
      onSingleLimitChange={handleSingleLimitChange}
      onDailyLimitChange={handleDailyLimitChange}
      onFinish={onFinish}
    />
  );
}
