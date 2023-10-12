import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useRef, useState } from 'react';
import myEvents from 'utils/deviceEvent';
import PinContainer from 'components/PinContainer';
import { StyleSheet } from 'react-native';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { getVerifiedAndLockWallet } from 'model/verify/after-verify';
import Loading from 'components/Loading';
import { isEnrolledAsync } from 'expo-local-authentication';
import { SetBiometricsProps, SetBiometricsResult } from '../set-biometrics';

const isBiometricsReady = async () => {
  try {
    return await isEnrolledAsync();
  } catch (e) {
    return false;
  }
};

export default function ConfirmPin({ oldPin, pin, deliveredSetPinInfo }: ConfirmPinPageProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();

  const { onFinish, navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.CONFIRM_PIN,
  });

  // const { biometrics } = useUser();
  // const onChangePin = useCallback(async (newPin: string) => {
  // TODO change pin process
  // if (!oldPin) return;
  // changeCanLock(false);
  // try {
  //   if (biometrics) await setSecureStoreItem('Pin', newPin);
  //   dispatch(changePin({ pin: oldPin, newPin }));
  //   dispatch(setCredentials({ pin: newPin }));
  //   CommonToast.success(t('Modified Successfully'));
  // } catch (error) {
  //   CommonToast.failError(error);
  // }
  // changeCanLock(true);
  // navigationService.navigate('AccountSettings');
  // }, []);

  const onSetPinSuccess = useCallback(
    async (confirmPin: string) => {
      const biometricsReady = await isBiometricsReady();
      if (biometricsReady) {
        navigateForResult<SetBiometricsResult, SetBiometricsProps>(
          PortkeyEntries.SET_BIO,
          {
            params: {
              pin: confirmPin,
              deliveredSetPinInfo,
            },
          },
          async result => {
            if (result?.status === 'success') {
              onFinish({
                status: 'success',
                data: {
                  finished: true,
                },
              });
            } else {
              setErrorMessage('Failed to set biometrics');
              pinRef.current?.reset();
            }
          },
        );
      } else {
        Loading.show();
        await getVerifiedAndLockWallet(deliveredSetPinInfo, confirmPin);
        Loading.hide();
        onFinish({
          status: 'success',
          data: {
            finished: true,
          },
        });
      }
    },
    [deliveredSetPinInfo, navigateForResult, onFinish],
  );

  const onChangeText = useCallback(
    async (confirmPin: string) => {
      if (confirmPin.length !== PIN_SIZE) {
        if (errorMessage) setErrorMessage(undefined);
        return;
      }

      if (confirmPin !== pin) {
        pinRef.current?.reset();
        return setErrorMessage('Pins do not match');
      }

      // if (oldPin) return onChangePin(confirmPin);
      return onSetPinSuccess(confirmPin);
    },
    [pin, onSetPinSuccess, errorMessage],
  );
  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={oldPin ? 'Change Pin' : undefined}
      onGestureStartCallback={() => {
        myEvents.clearSetPin.emit('clearSetPin');
      }}
      leftCallback={() => {
        pinRef.current?.reset();
        onFinish({
          status: 'cancel',
          data: {
            finished: false,
          },
        });
      }}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <PinContainer
        showHeader
        ref={pinRef}
        title="Confirm Pin"
        errorMessage={errorMessage}
        onChangeText={onChangeText}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export interface ConfirmPinPageProps {
  oldPin?: string;
  pin: string;
  deliveredSetPinInfo: string; // SetPinInfo
}
