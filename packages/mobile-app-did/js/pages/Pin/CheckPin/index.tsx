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
import { makeStyles } from '@rneui/themed';
import { VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';

export default function CheckPin() {
  const styles = getStyles();
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

const getStyles = makeStyles(_theme => ({
  container: {
    flex: 1,
  },
}));
