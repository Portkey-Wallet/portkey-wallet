import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import React, { useCallback, useRef } from 'react';
import navigationService from 'utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import CommonPrompt from 'components/CommonPromptCard';
import { setCredentials } from 'store/user/actions';
import myEvents from 'utils/deviceEvent';
import PinContainer from 'components/PinContainer';
import { makeStyles } from '@rneui/themed';
import { changeCanLock } from 'utils/LockManager';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';
import CommonToast from 'components/CommonToast';
import { useSetBiometrics } from 'hooks/useBiometrics';
import { useUpdateWalletAES } from '@portkey-wallet/hooks/hooks-eoa/wallet';

type RouterParams = {
  pin?: string;
  oldPin?: string;
  mnemonics?: string;
  privateKey?: string;
  isBackup?: boolean;
};

export default function ConfirmPin() {
  const styles = getStyles();
  const { pin, oldPin, mnemonics, privateKey, isBackup = false } = useRouterParams<RouterParams>();

  usePreventHardwareBack();

  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();

  const setBiometrics = useSetBiometrics();
  const updateWalletAES = useUpdateWalletAES();
  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) {
        return;
      }
      changeCanLock(false);
      try {
        updateWalletAES(oldPin, newPin);
        dispatch(setCredentials({ pin: newPin }));
        await setBiometrics(false);
        CommonToast.success('PIN updated');
        navigationService.navigate('Security');
      } catch (error) {
        CommonPrompt.failError(error);
      }
      changeCanLock(true);
    },
    [dispatch, oldPin, setBiometrics, updateWalletAES],
  );

  const { error: textError, setError: setTextError } = useErrorMessage();
  const onChangeText = useCallback(
    async (confirmPin: string) => {
      try {
        if (confirmPin.length !== PIN_SIZE) {
          if (textError.isError) {
            setTextError();
          }
          return;
        }

        if (confirmPin !== pin) {
          pinRef.current?.reset();
          setTextError('Incorrect PIN, please try again.', VERIFY_INVALID_TIME);
          return;
        }

        if (oldPin) {
          return onChangePin(confirmPin);
        } else {
          dispatch(setCredentials({ pin: confirmPin }));
        }
        await setBiometrics(false);
        navigationService.reset('PrepareWallet', { pin: confirmPin, mnemonics, privateKey, isBackup });
      } catch (error) {}
    },
    [
      pin,
      oldPin,
      setBiometrics,
      mnemonics,
      privateKey,
      isBackup,
      textError.isError,
      setTextError,
      onChangePin,
      dispatch,
    ],
  );

  return (
    <PageContainer
      titleDom
      type="leftBack"
      notHandleHardwareBackPress={true}
      onGestureStartCallback={() => {
        myEvents.clearSetPin.emit('clearSetPin');
      }}
      leftCallback={() => {
        myEvents.clearSetPin.emit('clearSetPin');
        navigationService.goBack();
      }}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <PinContainer
        showHeader
        ref={pinRef}
        title="Confirm your PIN"
        errorMessage={textError.errorMsg}
        onChangeText={onChangeText}
      />
    </PageContainer>
  );
}

const getStyles = makeStyles(_theme => ({
  container: {
    flex: 1,
  },
}));
