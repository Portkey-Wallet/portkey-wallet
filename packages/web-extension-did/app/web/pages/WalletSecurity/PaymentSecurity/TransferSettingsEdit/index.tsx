import { useCommonState } from 'store/Provider/hooks';
import TransferSettingsEditPopup from './Popup';
import TransferSettingsEditPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useState } from 'react';
import { ValidData } from 'pages/Contacts/AddContact';
import { Form } from 'antd';

export default function TransferSettingsEdit() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const headerTitle = t('Transfer Settings');
  const [restrictedText, setRestrictedText] = useState(!!state?.restricted);
  const [disable, setDisable] = useState(true);
  const [validSingleLimit, setValidSingleLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validDailyLimit, setValidDailyLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/payment-security');
  }, [navigate]);

  const handleRestrictedChange = useCallback((checked: boolean) => {
    setRestrictedText(checked);
    console.log('🌈 🌈 🌈 🌈 🌈 🌈 ', checked);
  }, []);

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
    <TransferSettingsEditPrompt
      headerTitle={headerTitle}
      goBack={handleBack}
      form={form}
      restrictedValue={restrictedText}
      state={state}
      disable={disable}
      validSingleLimit={validSingleLimit}
      validDailyLimit={validDailyLimit}
      onRestrictedChange={handleRestrictedChange}
      onSingleLimitChange={handleSingleLimitChange}
      onDailyLimitChange={handleDailyLimitChange}
      onFinish={onFinish}
    />
  ) : (
    <TransferSettingsEditPopup
      headerTitle={headerTitle}
      goBack={handleBack}
      form={form}
      restrictedValue={restrictedText}
      state={state}
      disable={disable}
      validSingleLimit={validSingleLimit}
      validDailyLimit={validDailyLimit}
      onRestrictedChange={handleRestrictedChange}
      onSingleLimitChange={handleSingleLimitChange}
      onDailyLimitChange={handleDailyLimitChange}
      onFinish={onFinish}
    />
  );
}
