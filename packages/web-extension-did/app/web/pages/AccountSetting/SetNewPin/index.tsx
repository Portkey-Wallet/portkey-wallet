import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/Provider/hooks';
import { ISetNewPinFormProps } from '../components/SetNewPinForm';
import SetNewPinPopup from './Popup';
import SetNewPinPrompt from './Prompt';
import { useCallback, useEffect } from 'react';
import { Form, message } from 'antd';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { changePin } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useNavigate, useLocation } from 'react-router-dom';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';

export type ISetNewPinProps = ISetNewPinFormProps & BaseHeaderProps;

export default function SetNewPin() {
  const { isNotLessThan768 } = useCommonState();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    state: { pin },
  } = useLocation();
  const { t } = useTranslation();
  const title = t('Change Pin');
  const setPinLabel = 'Please enter a new pin';
  const confirmPinLabel = 'Confirm new pin';
  const btnText = 'Save';

  useEffect(() => {
    return form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    const newPin = form.getFieldValue('confirmPassword');
    dispatch(setPasswordSeed(newPin));
    dispatch(
      changePin({
        pin,
        newPin,
      }),
    );
    await setPinAction(newPin);
    message.success(t('Modified Successfully'));
    navigate('/setting/account-setting');
  }, [dispatch, form, navigate, pin, t]);

  const onFinishFailed = useCallback(() => {
    message.error('Something error');
  }, []);

  const handleBack = useCallback(() => {
    form.resetFields();
    navigate('/setting/account-setting/confirm-pin');
  }, [form, navigate]);

  return isNotLessThan768 ? (
    <SetNewPinPrompt
      form={form}
      headerTitle={title}
      setPinLabel={setPinLabel}
      confirmPinLabel={confirmPinLabel}
      btnText={btnText}
      onFinishFailed={onFinishFailed}
      onSave={handleSave}
      goBack={handleBack}
    />
  ) : (
    <SetNewPinPopup
      form={form}
      headerTitle={title}
      setPinLabel={setPinLabel}
      confirmPinLabel={confirmPinLabel}
      btnText={btnText}
      onFinishFailed={onFinishFailed}
      onSave={handleSave}
      goBack={handleBack}
    />
  );
}
