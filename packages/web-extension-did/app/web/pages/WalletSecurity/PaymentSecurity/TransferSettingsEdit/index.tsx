import TransferSettingsEditPopup from './Popup';
import { useTranslation } from 'react-i18next';
import { useCallback, useRef, useState } from 'react';
import { ValidData } from 'pages/Contacts/AddContact';
import { Form } from 'antd';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { LimitFormatTip, SingleExceedDaily } from 'constants/security';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { useEffectOnce } from 'react-use';
import { ICheckLimitBusiness } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TTransferSettingEditLocationState } from 'types/router';
import { useSetLimit } from '../TransferSettings/useSetLimit';

export default function TransferSettingsEdit() {
  const { t } = useTranslation();
  const { state } = useLocationState<TTransferSettingEditLocationState>();
  const navigate = useNavigateState();
  const [form] = Form.useForm();
  const headerTitle = t('Transaction Limits');
  const [restrictedText, setRestrictedText] = useState(!!state?.restricted);
  const restrictedTextRef = useRef(!!state?.restricted);
  const [disable, setDisable] = useState(true);
  const [validSingleLimit, setValidSingleLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validDailyLimit, setValidDailyLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });

  const handleDisableCheck = useCallback(() => {
    const { singleLimit, dailyLimit } = form.getFieldsValue();

    if (restrictedTextRef.current) {
      setDisable(!singleLimit || !dailyLimit);
    } else {
      setDisable(false);
    }
  }, [form]);

  const handleFormChange = useCallback(() => {
    const { singleLimit, dailyLimit } = form.getFieldsValue();

    let errorCount = 0;

    if (restrictedTextRef.current) {
      // Transfers restricted
      // CHECK 1: singleLimit is a positive integer
      if (isValidInteger(singleLimit)) {
        setValidSingleLimit({ validateStatus: '', errorMsg: '' });
      } else {
        setValidSingleLimit({ validateStatus: 'error', errorMsg: LimitFormatTip });
        errorCount++;
      }
      // CHECK 2: dailyLimit is a positive integer
      if (isValidInteger(dailyLimit)) {
        setValidDailyLimit({ validateStatus: '', errorMsg: '' });
      } else {
        setValidDailyLimit({ validateStatus: 'error', errorMsg: LimitFormatTip });
        errorCount++;
      }
      // CHECK 3: dailyLimit >= singleLimit
      if (isValidInteger(singleLimit) && isValidInteger(dailyLimit)) {
        if (Number(dailyLimit) >= Number(singleLimit)) {
          setValidSingleLimit({ validateStatus: '', errorMsg: '' });
        } else {
          setValidSingleLimit({ validateStatus: 'error', errorMsg: SingleExceedDaily });
          errorCount++;
        }
      }
    }
    return errorCount;
  }, [form]);

  const handleBack = useCallback(() => {
    const res = state?.initStateBackUp || state;
    if (state.from === ICheckLimitBusiness.SEND) {
      return navigate(`/send/token/${state.symbol}`, { state: { ...res, ...state.extra } });
    }
    if (state.from === ICheckLimitBusiness.RAMP_SELL) {
      return navigate('/buy', { state: { ...res, ...state.extra } });
    }
    navigate('/setting/wallet-security/payment-security/transfer-settings', { state: { ...res, ...state.extra } });
  }, [navigate, state]);

  const handleRestrictedChange = useCallback(
    (checked: boolean) => {
      setRestrictedText(checked);
      restrictedTextRef.current = checked;

      handleDisableCheck();
    },
    [handleDisableCheck],
  );

  const handleSingleLimitChange = useCallback(() => {
    handleDisableCheck();
    setValidSingleLimit({ validateStatus: '', errorMsg: '' });
  }, [handleDisableCheck]);

  const handleDailyLimitChange = useCallback(() => {
    handleDisableCheck();
    setValidDailyLimit({ validateStatus: '', errorMsg: '' });
  }, [handleDisableCheck]);

  const { handleSetLimit } = useSetLimit();

  const onFinish = useCallback(async () => {
    const errorCount = handleFormChange();
    if (errorCount > 0) return;
    const { singleLimit, dailyLimit } = form.getFieldsValue();
    await handleSetLimit({
      state,
      singleLimit,
      dailyLimit,
      restricted: restrictedTextRef.current,
    });
  }, [form, handleFormChange, handleSetLimit, state]);

  useEffectOnce(() => {
    if (!state?.restricted) {
      form.setFieldValue('singleLimit', divDecimals(state?.defaultSingleLimit, state.decimals).toFixed());
      form.setFieldValue('dailyLimit', divDecimals(state?.defaultDailyLimit, state.decimals).toFixed());
    }
    handleDisableCheck();
  });

  return (
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
