import React, { useCallback, useEffect, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from '@portkey-wallet/rn-components/components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PinContainer from '@portkey-wallet/rn-components/components/PinContainer';
import { StyleSheet } from 'react-native';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { checkPin, unLockTempWallet } from 'model/verify/core';
import { touchAuth } from '../SetBiometrics';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import { UnlockedWallet, getUnlockedWallet } from 'model/wallet';
import { useUser } from 'store/hook';
import useBiometricsReady from 'hooks/useBiometrics';
import useNavigation from 'core/router/hook';

export default function CheckPin(props: CheckPinProps) {
  const { targetScene, openBiometrics } = props;
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  const { biometrics } = useUser();
  const biometricsReady = useBiometricsReady();
  const canUseBiometrics = !openBiometrics && targetScene !== 'changePin' && !!biometrics && !!biometricsReady;
  const navigation = useNavigation();

  const onChangeText = useCallback(
    async (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!(await checkPin(pin))) {
          pinRef.current?.reset();
          return setErrorMessage(PinErrorMessage.invalidPin);
        }
        if (targetScene === 'changePin') {
          navigation.navigate(PortkeyEntries.SET_PIN, {
            oldPin: pin,
          });
          return;
        }
        Loading.show();
        if (openBiometrics) {
          myEvents.openBiometrics.emit(pin);
        } else {
          unLockTempWallet(pin).then(async () => {
            Loading.hide();
            const walletInfo = await getUnlockedWallet();
            navigation.goBack({
              status: 'success',
              data: {
                pin,
                walletInfo,
              },
            });
          });
        }
      } else if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, navigation, openBiometrics, targetScene],
  );

  const handleBiometrics = useCallback(async () => {
    const res = await touchAuth();
    if (res?.success) {
      Loading.show();
      await unLockTempWallet('use-bio', true);
      const walletInfo = await getUnlockedWallet();
      Loading.hide();
      navigation.goBack({
        status: 'success',
        data: {
          pin: 'FAKE',
          walletInfo,
        },
      });
    } else {
      setErrorMessage('Biometrics failed');
    }
  }, [navigation]);

  useEffect(() => {
    if (canUseBiometrics) {
      handleBiometrics();
    }
  }, [canUseBiometrics, handleBiometrics]);

  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={'Back'}
      containerStyles={styles.container}
      leftCallback={() => {
        navigation.goBack({
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
