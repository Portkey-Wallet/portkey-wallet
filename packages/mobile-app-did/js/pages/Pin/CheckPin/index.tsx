import React, { useCallback, useRef } from 'react';
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
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorTimer } from '@portkey-wallet/hooks/hooks-ca/misc';

export default function CheckPin() {
  const { openBiometrics } = useRouterParams<{ openBiometrics?: boolean }>();
  const pinRef = useRef<DigitInputInterface>();
  useFocusEffect(
    useCallback(() => {
      pinRef.current?.reset();
    }, []),
  );

  const { error: textError, setErrorTimer, clearErrorTimer } = useErrorTimer(VERIFY_INVALID_TIME);
  const onChangeText = useCallback(
    (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!checkPin(pin)) {
          pinRef.current?.reset();
          setErrorTimer(PinErrorMessage.invalidPin);
          return;
        }
        if (openBiometrics) {
          myEvents.openBiometrics.emit(pin);
          navigationService.goBack();
        } else {
          navigationService.navigate('SetPin', { oldPin: pin });
        }
      } else if (textError.isError) {
        clearErrorTimer();
      }
    },
    [clearErrorTimer, openBiometrics, setErrorTimer, textError.isError],
  );
  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={!openBiometrics ? 'Change Pin' : 'Authentication'}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <PinContainer
        showHeader
        ref={pinRef}
        title="Enter Pin"
        errorMessage={textError.errorMsg}
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
