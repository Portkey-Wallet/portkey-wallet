import React, { useCallback, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PinContainer from '@portkey-wallet/rn-components/components/PinContainer';
import { StyleSheet } from 'react-native';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { checkPin, getUseBiometric, unLockTempWallet } from 'model/verify/core';
import { touchAuth } from '../SetBiometrics';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import { UnlockedWallet, getUnlockedWallet } from 'model/wallet';

export default function CheckPin(props: CheckPinProps) {
  const { targetScene, openBiometrics } = props;
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const { onFinish, navigateTo } = useBaseContainer({
    entryName: PortkeyEntries.CHECK_PIN,
  });

  const onChangeText = useCallback(
    async (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!(await checkPin(pin))) {
          pinRef.current?.reset();
          return setErrorMessage(PinErrorMessage.invalidPin);
        }
        if (targetScene === 'changePin') {
          navigateTo(PortkeyEntries.SET_PIN, {
            params: {
              oldPin: pin,
            },
          });
          return;
        }
        Loading.show();
        myEvents.openBiometrics.emit(pin);
        unLockTempWallet(pin).then(async () => {
          Loading.hide();
          const walletInfo = await getUnlockedWallet();
          onFinish<CheckPinResult>({
            status: 'success',
            data: {
              pin,
              walletInfo,
            },
          });
        });
      } else if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, navigateTo, onFinish, targetScene],
  );

  const handleBiometrics = async () => {
    const res = await touchAuth();
    if (res?.success) {
      Loading.show();
      await unLockTempWallet('use-bio', true);
      const walletInfo = await getUnlockedWallet();
      Loading.hide();
      onFinish<CheckPinResult>({
        status: 'success',
        data: {
          pin: 'FAKE',
          walletInfo,
        },
      });
    } else {
      setErrorMessage('Biometrics failed');
    }
  };

  useEffectOnce(() => {
    if (openBiometrics || targetScene === 'changePin') {
      // from Biometric op switch page, or from changePin Scene. do not need Biometrics op button
      return;
    }
    getUseBiometric().then(res => {
      setCanUseBiometrics(res);
      if (res) {
        handleBiometrics();
      }
    });
  });

  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={'Back'}
      containerStyles={styles.container}
      leftCallback={() => {
        onFinish<CheckPinResult>({
          status: 'cancel',
          data: { pin: '' },
        });
      }}
      scrollViewProps={{ disabled: true }}>
      <PinContainer
        showHeader
        ref={pinRef}
        title="Enter Pin"
        errorMessage={errorMessage}
        onChangeText={onChangeText}
        isBiometrics={canUseBiometrics}
        onBiometricsPress={handleBiometrics}
      />
    </PageContainer>
  );
}

export interface CheckPinProps {
  rootTag?: any;
  targetScene: 'changePin';
  openBiometrics?: boolean;
}

export interface CheckPinResult {
  pin: string;
  walletInfo?: UnlockedWallet;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
