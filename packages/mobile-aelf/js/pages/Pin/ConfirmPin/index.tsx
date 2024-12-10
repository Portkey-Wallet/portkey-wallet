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

type RouterParams = {
  pin?: string;
  oldPin?: string;
};

export default function ConfirmPin() {
  const styles = getStyles();
  const { pin, oldPin } = useRouterParams<RouterParams>();

  usePreventHardwareBack();

  const pinRef = useRef<DigitInputInterface>();
  const dispatch = useAppDispatch();

  const setBiometrics = useSetBiometrics();
  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) {
        return;
      }
      changeCanLock(false);
      try {
        // TODO: eoa update Pin need reEncrypt
        // dispatch(changePin({ pin: oldPin, newPin }));
        dispatch(setCredentials({ pin: newPin }));
        CommonToast.success('PIN updated');
      } catch (error) {
        CommonPrompt.failError(error);
      }
      changeCanLock(true);
      navigationService.reset('PrepareWallet', { pin });
    },
    [dispatch, oldPin, pin],
  );

  const { error: textError, setError: setTextError } = useErrorMessage();
  const onChangeText = useCallback(
    async (confirmPin: string) => {
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
      }

      await setBiometrics(false);
      navigationService.reset('PrepareWallet', { pin: confirmPin });
    },
    [pin, oldPin, setBiometrics, textError.isError, setTextError, onChangePin],
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
