import React, { useCallback, useRef } from 'react';
import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import { DigitInputInterface } from '@portkey-wallet/rn-components/components/DigitInput';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { useRouterParams } from '@portkey-wallet/rn-inject-sdk';
import { checkPin } from '@portkey-wallet/rn-base/utils/redux';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';
import { useFocusEffect } from '@portkey-wallet/rn-inject-sdk';
import PinContainer from '@portkey-wallet/rn-components/components/PinContainer';
import { StyleSheet } from 'react-native';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';

export default function CheckPin() {
  const { openBiometrics } = useRouterParams<{ openBiometrics?: boolean }>();
  const pinRef = useRef<DigitInputInterface>();
  useFocusEffect(
    useCallback(() => {
      pinRef.current?.reset();
    }, []),
  );

  const { error: textError, setError: setTextError } = useErrorMessage();
  const onChangeText = useCallback(
    (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!checkPin(pin)) {
          pinRef.current?.reset();
          setTextError(PinErrorMessage.invalidPin, VERIFY_INVALID_TIME);
          return;
        }
        if (openBiometrics) {
          myEvents.openBiometrics.emit(pin);
          navigationService.goBack();
        } else {
          navigationService.navigate('SetPin', { oldPin: pin });
        }
      } else if (textError.isError) {
        setTextError();
      }
    },
    [openBiometrics, setTextError, textError.isError],
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
