import { ChangeEventHandler, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import aes from '@portkey-wallet/utils/aes';
import ConfirmPinPopup from './Popup';
// import ConfirmPinPrompt from './Prompt';
import { BaseHeaderProps } from 'types/UI';
// import { useCommonState } from 'store/Provider/hooks';
import { useNavigateState } from 'hooks/router';
import { TSetNewPinLocationState } from 'types/router';
import singleMessage from 'utils/singleMessage';
import { getWalletsInfo } from 'utils/lib/SWGetReduxStore';
import { WalletError } from '@portkey-wallet/store/wallet/type';

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
  // const { isNotLessThan768 } = useCommonState();

  const handleNext = useCallback(async () => {
    const wallet = await getWalletsInfo();

    if (wallet.walletAddedCount <= 0) return singleMessage.error(WalletError.noCreateWallet);

    const unlockedData = aes.decrypt(
      wallet.walletList[0].AESEncryptMnemonic || wallet.walletList[0].accountList[0].AESEncryptPrivateKey,
      pin,
    );
    if (unlockedData) {
      setErrMsg('');
      setDisable(false);
      navigate('/setting/security/set-new-pin', { state: { pin: pin } });
    } else {
      setPin('');
      setErrMsg('Incorrect Pin');
      setDisable(true);
    }
  }, [navigate, pin]);

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

  const title = t('');
  const pinLabel = t('');
  const placeholder = t('Enter Pin');
  const btnText = t('Next');
  const goBack = () => {
    navigate('/setting/security');
  };

  return (
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
