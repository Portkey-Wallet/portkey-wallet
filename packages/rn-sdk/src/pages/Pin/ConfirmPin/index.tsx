import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from '@portkey-wallet/rn-components/components/DigitInput';
import React, { useCallback, useRef, useState } from 'react';
import myEvents from 'utils/deviceEvent';
import PinContainer from '@portkey-wallet/rn-components/components/PinContainer';
import { StyleSheet } from 'react-native';
import { PortkeyEntries } from 'config/entries';
import { changePin, getVerifiedAndLockWallet } from 'model/verify/core';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import { touchAuth } from '../SetBiometrics';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { authenticateBioReady, isBiometricsCanUse } from 'service/biometric';
import useNavigation from 'core/router/hook';
import { useUser } from 'store/hook';

export default function ConfirmPin({ oldPin, pin, deliveredSetPinInfo }: ConfirmPinPageProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const navigation = useNavigation();
  const { biometrics } = useUser();

  const onChangePin = useCallback(
    async (newPin: string) => {
      if (!oldPin) return;
      try {
        const canUse = !!biometrics;
        const biometricsReady = await authenticateBioReady();
        if (canUse) {
          if (biometricsReady) {
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
        navigation.navigate(PortkeyEntries.ACCOUNT_SETTING_ENTRY, { modified: true });
      } catch (error) {
        CommonToast.failError(error);
      }
    },
    [biometrics, navigation, oldPin],
  );
  const onSetPinSuccess = useCallback(
    async (confirmPin: string) => {
      const biometricsReady = await authenticateBioReady();
      if (biometricsReady) {
        navigation.navigateByResult(
          PortkeyEntries.SET_BIO,
          async result => {
            if (result?.status === 'success') {
              navigation.goBack({
                animated: false,
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
          {
            pin: confirmPin,
            deliveredSetPinInfo,
          },
        );
      } else {
        Loading.show();
        const res = await getVerifiedAndLockWallet(deliveredSetPinInfo, confirmPin);
        Loading.hide();
        if (res) {
          navigation.goBack({
            animated: false,
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
    [deliveredSetPinInfo, navigation],
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
        navigation.goBack({
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
