import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/Provider/hooks';
import { ISetNewPinFormProps } from '../components/SetNewPinForm';
import SetNewPinPopup from './Popup';
import { useCallback, useEffect } from 'react';
import { Form } from 'antd';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { useNavigate } from 'react-router-dom';
import { setPasswordSeed } from 'store/reducers/user/slice';
import { BaseHeaderProps } from 'types/UI';
import singleMessage from 'utils/singleMessage';
import { useLocationState } from 'hooks/router';
import { TSetNewPinLocationState } from 'types/router';
import { useUpdateWalletAES } from '@portkey-wallet/hooks/hooks-eoa/wallet';

export type ISetNewPinProps = ISetNewPinFormProps & BaseHeaderProps;

export default function SetNewPin() {
  const updateWalletAES = useUpdateWalletAES();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    state: { pin },
  } = useLocationState<TSetNewPinLocationState>();
  const { t } = useTranslation();
  const title = t('');
  const setPinLabel = 'New PIN';
  const confirmPinLabel = 'Confirm PIN';
  const btnText = 'Continue';

  useEffect(() => {
    return form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    const newPin = form.getFieldValue('confirmPassword');
    dispatch(setPasswordSeed(newPin));
    updateWalletAES(pin, newPin);
    await setPinAction(newPin);
    singleMessage.success(t('PIN updated'));
    navigate('/setting/security');
  }, [dispatch, form, navigate, pin, t, updateWalletAES]);

  const onFinishFailed = useCallback(() => {
    singleMessage.error('Something error');
  }, []);

  const handleBack = useCallback(() => {
    form.resetFields();
    navigate('/setting/security/confirm-pin');
  }, [form, navigate]);

  return (
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
