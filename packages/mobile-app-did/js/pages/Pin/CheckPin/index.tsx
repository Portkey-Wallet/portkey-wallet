import React, { useCallback, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import navigationService from 'utils/navigationService';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { checkPin } from 'utils/redux';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import myEvents from 'utils/deviceEvent';
import { useFocusEffect } from '@react-navigation/native';
import PinContainer from 'components/PinContainer';
import { StyleSheet } from 'react-native';

export default function CheckPin() {
  const { openBiometrics } = useRouterParams<{ openBiometrics?: boolean }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  useFocusEffect(
    useCallback(() => {
      pinRef.current?.reset();
    }, []),
  );
  const onChangeText = useCallback(
    (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!checkPin(pin)) {
          pinRef.current?.reset();
          return setErrorMessage(PinErrorMessage.invalidPin);
        }
        if (openBiometrics) {
          myEvents.openBiometrics.emit(pin);
          navigationService.goBack();
        } else {
          navigationService.navigate('SetPin', { oldPin: pin });
        }
      } else if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, openBiometrics],
  );
  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={!openBiometrics ? 'Change Pin' : 'Authentication'}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <PinContainer showHeader ref={pinRef} title="Enter Pin" errorMessage={errorMessage} onChangeText={onChangeText} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
