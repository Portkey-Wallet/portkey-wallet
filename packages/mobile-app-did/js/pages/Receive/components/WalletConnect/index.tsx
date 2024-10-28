import React, { useCallback } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import '@walletconnect/react-native-compat';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import CommonButton from 'components/CommonButton';

const projectId = '6733595637fa2afd8bb831ac36a906af'; // todo_wade: move to env

const providerMetadata = {
  name: 'Portkey Wallet',
  description: 'Your first AA wallet for Web2 to Web3 migration',
  url: 'https://portkey.finance/',
  icons: [
    'https://play-lh.googleusercontent.com/YYFh-iAZmZdx9incotkWK9BbnPNIftZk9aHKm3qlWlsmU0nofS-lge0i9-Gy0Oj_ohM=w480-h960-rw',
  ],
  redirect: {
    native: 'com.portkey.finance://',
    universal: 'https://portkey.finance/',
  },
};

export default function WalletConnect() {
  const styles = getStyles();
  const { open, isConnected, provider } = useWalletConnectModal();

  const onPress = useCallback(() => {
    if (isConnected) {
      console.log('disconnect');
      provider?.disconnect();
    } else {
      console.log('open');
      open();
    }
  }, [isConnected, open, provider]);
  return (
    <View style={styles.container}>
      <CommonButton
        type="primary"
        title={isConnected ? 'Disconnect external wallet' : 'Connect external wallet'}
        onPress={onPress}
      />
      <WalletConnectModal projectId={projectId} providerMetadata={providerMetadata} />
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    marginTop: pTd(16),
    width: '100%',
  },
}));
