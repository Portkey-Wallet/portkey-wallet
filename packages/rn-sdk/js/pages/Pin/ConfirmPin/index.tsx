import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useRef, useState } from 'react';
import myEvents from 'utils/deviceEvent';
import PinContainer from 'components/PinContainer';
import { StyleSheet } from 'react-native';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { changePin, getVerifiedAndLockWallet } from 'model/verify/after-verify';
import Loading from 'components/Loading';
import { SetBiometricsProps, SetBiometricsResult, touchAuth } from '../SetBiometrics';
import { isEnrolledAsync } from 'expo-local-authentication';
import CommonToast from 'components/CommonToast';
import { useLanguage } from 'i18n/hooks';
import { authenticateBioReady, isBiomtricsCanUse } from 'service/biometric';

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
  const { t } = useLanguage();

  const { onFinish, navigateForResult, navigationTo } = useBaseContainer({
    entryName: PortkeyEntries.CONFIRM_PIN,
  });
  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) return;
      try {
        const canUse = isBiomtricsCanUse();
        const biometricsReady = authenticateBioReady();
        if (await canUse) {
          if (await biometricsReady) {
            const res = await touchAuth();
            if (!res?.success) {
              CommonToast.failError('Failed To Verify');
              return;
            }
          }
          changePin(newPin);
        } else {
          changePin(newPin);
        }
        CommonToast.success(t('Modified Successfully'));
      } catch (error) {
        CommonToast.failError(error);
      }
      // navigateForResult(PortkeyEntries.ACCOUNT_SETTING_ENTRY, {
      //   params: { name: 'frank', age: 20, sex: 'male' },
      // });
      navigateForResult(PortkeyEntries.ACCOUNT_SETTING_ENTRY, {});
    },
    [navigateForResult, oldPin, t],
  );
  const onSetPinSuccess = useCallback(
    async (confirmPin: string) => {
      const biometricsReady = await authenticateBioReady();
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
        const res = await getVerifiedAndLockWallet(deliveredSetPinInfo, confirmPin);
        Loading.hide();
        if (res) {
          onFinish({
            status: 'success',
            data: {
              finished: true,
            },
          });
        } else {
          setErrorMessage('network failure');
          pinRef.current?.reset();
        }
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

      if (oldPin) return onChangePin(confirmPin);
      return onSetPinSuccess(confirmPin);
    },
    [pin, oldPin, onChangePin, onSetPinSuccess, errorMessage],
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
