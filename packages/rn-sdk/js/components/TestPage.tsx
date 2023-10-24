import React, { useState } from 'react';
import 'react-native-get-random-values';
import { View, Text, TouchableOpacityProps, TouchableOpacity, StyleSheet } from 'react-native';
import AElf from 'aelf-sdk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'blue',
    borderRadius: 8,
    color: 'white',
  },
  buttonWrapper: {
    marginVertical: 3,
  },
});
function Button(props: TouchableOpacityProps & { title: string }) {
  const { title, ...touchableOpacityProps } = props;
  return (
    <TouchableOpacity style={styles.buttonWrapper} {...touchableOpacityProps} activeOpacity={0.6}>
      <Text style={styles.button}>{title}</Text>
    </TouchableOpacity>
  );
}
export default function Screen(_props: any) {
  const [wallet, setWallet] = useState<any>();
  return (
    <View style={styles.container}>
      <View>
        <Text>walletInfo:{wallet?.address}</Text>
      </View>
      <Button
        title="createNewWallet"
        onPress={() => {
          const tmpWalletInfo = AElf.wallet.createNewWallet();
          setWallet(tmpWalletInfo);
        }}
      />
    </View>
  );
}
