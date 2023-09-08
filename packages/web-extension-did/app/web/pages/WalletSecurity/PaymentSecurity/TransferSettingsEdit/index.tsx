import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import TransferSettingsEditPopup from './Popup';
import TransferSettingsEditPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { ValidData } from 'pages/Contacts/AddContact';
import { Form } from 'antd';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import useGuardianList from 'hooks/useGuardianList';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { LimitFormatTip, SingleExceedDaily } from 'constants/security';

export default function TransferSettingsEdit() {
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { walletInfo } = useCurrentWallet();
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const headerTitle = t('Transfer Settings');
  const [restrictedText, setRestrictedText] = useState(!!state?.restricted);
  const [disable, setDisable] = useState(true);
  const [validSingleLimit, setValidSingleLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [validDailyLimit, setValidDailyLimit] = useState<ValidData>({ validateStatus: '', errorMsg: '' });

  const handleFormChange = useCallback(() => {
    const { restricted, singleLimit, dailyLimit } = form.getFieldsValue();

    if (restricted) {
      if (Number(singleLimit) > Number(dailyLimit)) {
        setDisable(true);
        return setValidSingleLimit({ validateStatus: 'error', errorMsg: SingleExceedDaily });
      } else {
        setValidSingleLimit({ validateStatus: '', errorMsg: '' });
      }
    }

    setDisable(!((restricted && singleLimit && dailyLimit) || !restricted));
  }, [form]);

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/payment-security');
  }, [navigate]);

  const handleRestrictedChange = useCallback(
    (checked: boolean) => {
      setRestrictedText(checked);
      handleFormChange();
    },
    [handleFormChange],
  );

  const handleSingleLimitChange = useCallback(
    (v: string) => {
      if (isValidInteger(v)) {
        setValidSingleLimit({ validateStatus: '', errorMsg: '' });
        handleFormChange();
      } else {
        return setValidSingleLimit({ validateStatus: 'error', errorMsg: LimitFormatTip });
      }
    },
    [handleFormChange],
  );

  const handleDailyLimitChange = useCallback(
    (v: string) => {
      if (isValidInteger(v)) {
        setValidDailyLimit({ validateStatus: '', errorMsg: '' });
        handleFormChange();
      } else {
        return setValidDailyLimit({ validateStatus: 'error', errorMsg: LimitFormatTip });
      }
    },
    [handleFormChange],
  );

  const handleSetLimit = useCallback(async () => {
    // ====== clear guardian cache ====== start
    dispatch(
      setLoginAccountAction({
        guardianAccount: walletInfo.managerInfo?.loginAccount as string,
        loginType: walletInfo.managerInfo?.type as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    // ====== clear guardian cache ====== end

    const { restricted, singleLimit, dailyLimit } = form.getFieldsValue();
    const params = {
      dailyLimit,
      singleLimit,
      symbol: state.symbol,
      decimals: state.decimals,
      restricted,
    };

    isPrompt
      ? navigate('/setting/wallet-security/payment-security/guardian-approval', {
          state: `setTransferLimit_${JSON.stringify(params)}`,
        })
      : InternalMessage.payload(
          PortkeyMessageTypes.GUARDIANS_APPROVAL,
          `setTransferLimit_${JSON.stringify(params)}`,
        ).send();
  }, [
    dispatch,
    walletInfo.managerInfo?.loginAccount,
    walletInfo.managerInfo?.type,
    walletInfo.caHash,
    userGuardianList,
    form,
    state.symbol,
    state.decimals,
    isPrompt,
    navigate,
  ]);

  const onFinish = useCallback(() => {
    handleSetLimit();
  }, [handleSetLimit]);

  useEffect(() => {
    handleFormChange();
  }, [handleFormChange]);

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
