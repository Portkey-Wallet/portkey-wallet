import { ChangeEventHandler, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import aes from '@portkey-wallet/utils/aes';
import ConfirmPinPopup from './Popup';
import ConfirmPinPrompt from './Prompt';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useNavigateState } from 'hooks/router';
import { TSetNewPinLocationState } from 'types/router';

export interface IConfirmPinProps extends BaseHeaderProps {
  pinLabel: string;
  pin: string;
  placeholder: string;
  errMsg: string;
  submitDisable: boolean;
  btnText: string;
  onChangePin: ChangeEventHandler<HTMLInputElement>;
  handleNext: () => void;
}

export default function ConfirmPin() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TSetNewPinLocationState>();
  const [disable, setDisable] = useState<boolean>(true);
  const [pin, setPin] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const walletInfo = useCurrentWalletInfo();
  const { isNotLessThan768 } = useCommonState();

  const handleNext = useCallback(async () => {
    const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
    if (privateKey) {
      setErrMsg('');
      setDisable(false);
      navigate('/setting/account-setting/set-new-pin', { state: { pin: pin } });
    } else {
      setPin('');
      setErrMsg('Incorrect Pin');
      setDisable(true);
    }
  }, [navigate, pin, walletInfo.AESEncryptPrivateKey]);

  const handleInputChange = useCallback((v: string) => {
    setErrMsg('');
    if (!v) {
      setDisable(true);
      setPin('');
    } else {
      setDisable(false);
      setPin(v);
    }
  }, []);

  const title = t('Change Pin');
  const pinLabel = t('Pin');
  const placeholder = t('Enter Pin');
  const btnText = t('Next');
  const goBack = () => {
    navigate('/setting/account-setting');
  };

  return isNotLessThan768 ? (
    <ConfirmPinPrompt
      headerTitle={title}
      pinLabel={pinLabel}
      pin={pin}
      placeholder={placeholder}
      errMsg={errMsg}
      submitDisable={disable}
      btnText={btnText}
      onChangePin={(e) => handleInputChange(e.target.value)}
      handleNext={handleNext}
      goBack={goBack}
    />
  ) : (
    <ConfirmPinPopup
      headerTitle={title}
      pinLabel={pinLabel}
      pin={pin}
      placeholder={placeholder}
      errMsg={errMsg}
      submitDisable={disable}
      btnText={btnText}
      onChangePin={(e) => handleInputChange(e.target.value)}
      handleNext={handleNext}
      goBack={goBack}
    />
  );
}
