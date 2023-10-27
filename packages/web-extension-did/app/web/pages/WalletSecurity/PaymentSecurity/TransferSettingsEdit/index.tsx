import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import TransferSettingsEditPopup from './Popup';
import TransferSettingsEditPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useRef, useState } from 'react';
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
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { useEffectOnce } from 'react-use';

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
    navigate('/setting/wallet-security/payment-security/transfer-settings', { state: state?.initStateBackUp || state });
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

    const { singleLimit, dailyLimit } = form.getFieldsValue();
    const params = {
      dailyLimit: timesDecimals(dailyLimit, state.decimals).toFixed(),
      singleLimit: timesDecimals(singleLimit, state.decimals).toFixed(),
      symbol: state.symbol,
      fromSymbol: state.fromSymbol,
      decimals: state.decimals,
      restricted: restrictedTextRef.current,
      from: state.from,
      targetChainId: state.chainId,
      initStateBackUp: state,
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
    state,
    isPrompt,
    navigate,
  ]);

  const onFinish = useCallback(() => {
    const errorCount = handleFormChange();
    if (errorCount > 0) return;
    handleSetLimit();
  }, [handleFormChange, handleSetLimit]);

  useEffectOnce(() => {
    if (!state?.restricted) {
      form.setFieldValue('singleLimit', divDecimals(state?.defaultSingleLimit, state.decimals).toFixed());
      form.setFieldValue('dailyLimit', divDecimals(state?.defaultDailyLimit, state.decimals).toFixed());
    }
    handleDisableCheck();
  });

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
