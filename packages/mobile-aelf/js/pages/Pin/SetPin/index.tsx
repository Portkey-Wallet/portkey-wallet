import React, { useRef } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import PinContainer from 'components/PinContainer';
import { makeStyles } from '@rneui/themed';
import { usePreventHardwareBack } from '@portkey-wallet/hooks/mobile';

type TRouterParams = {
  oldPin?: string;
  isBackHide?: boolean;
  mnemonics?: string;
  privateKey?: string;
};

const scrollViewProps = {
  disabled: true,
};

export default function SetPin() {
  const styles = getStyles();
  const { oldPin, isBackHide, mnemonics, privateKey } = useRouterParams<TRouterParams>();
  const digitInput = useRef<DigitInputInterface>();
  usePreventHardwareBack();

  return (
    <PageContainer
      scrollViewProps={scrollViewProps}
      titleDom
      noLeftDom={isBackHide}
      type="leftBack"
      notHandleHardwareBackPress
      containerStyles={styles.container}>
      <PinContainer
        showHeader
        ref={digitInput}
        title={oldPin ? 'Create a new PIN to protect your wallet' : 'Create a PIN to protect your wallet'}
        onFinish={pin => {
          navigationService.navigate('ConfirmPin', {
            oldPin,
            pin,
            mnemonics,
            privateKey,
          });
        }}
      />
    </PageContainer>
  );
}

const getStyles = makeStyles(_theme => ({
  container: {
    flex: 1,
  },
}));
