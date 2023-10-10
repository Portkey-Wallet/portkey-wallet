import React, { useCallback, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import PinContainer from 'components/PinContainer';
import { StyleSheet } from 'react-native';
import { PinErrorMessage } from '@portkey-wallet/utils/wallet/types';
import { headPin } from '../core';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';

export default function CheckPin(props: CheckPinProps) {
  const { rootTag } = props;
  const [errorMessage, setErrorMessage] = useState<string>();
  const pinRef = useRef<DigitInputInterface>();

  const { onFinish } = useBaseContainer({
    rootTag: rootTag,
    entryName: PortkeyEntries.CHECK_PIN,
  });

  const onChangeText = useCallback(
    (pin: string) => {
      if (pin.length === PIN_SIZE) {
        if (!headPin(pin)) {
          pinRef.current?.reset();
          return setErrorMessage(PinErrorMessage.invalidPin);
        }
        onFinish<CheckPinResult>({
          status: 'success',
          data: {
            pin,
          },
        });
      } else if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, onFinish],
  );

  return (
    <PageContainer
      titleDom
      type="leftBack"
      backTitle={'back'}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <PinContainer showHeader ref={pinRef} title="Enter Pin" errorMessage={errorMessage} onChangeText={onChangeText} />
    </PageContainer>
  );
}

export interface CheckPinProps {
  rootTag: any;
}

export interface CheckPinResult {
  pin: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
