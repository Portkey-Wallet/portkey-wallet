import React, { useCallback, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import myEvents from 'utils/deviceEvent';
import PinContainer from 'components/PinContainer';
import { StyleSheet } from 'react-native';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import { headPin } from '../core';

export default function CheckPin(props: CheckPinProps) {
  const { openBiometrics } = props;
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();
  // useFocusEffect(
  //   useCallback(() => {
  //     pinRef.current?.reset();
  //   }, []),
  // );
  const onChangeText = useCallback(
    (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!headPin(pin)) {
          pinRef.current?.reset();
          return setErrorMessage(PinErrorMessage.invalidPin);
        }
        if (openBiometrics) {
          myEvents.openBiometrics.emit(pin);
          // navigationService.goBack();
        } else {
          // navigationService.navigate('SetPin', { oldPin: pin });
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

export interface CheckPinProps {
  openBiometrics?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
