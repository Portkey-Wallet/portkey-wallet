import React, { useState } from 'react';
import "react-native-get-random-values";
import { View, Text, TouchableOpacityProps, TouchableOpacity } from 'react-native';
import AElf from 'aelf-sdk';
import WebView from 'react-native-webview';
function Button(props: TouchableOpacityProps & { title: string }) {
  const { title, ...touchableOpacityProps } = props;
  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
const Endpoint = 'https://tdvw-test-node.aelf.io';
export default function Screen() {
  const [wallet, setWallet] = useState<any>();
  return (
    <View style={{ flex: 1, paddingVertical: 100, backgroundColor: 'white' }}>
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
      <Button
        title="GetBalance"
        onPress={async () => {
          const instance = new AElf(new AElf.providers.HttpProvider(Endpoint));
          const contract = await instance.chain.contractAt('ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx', wallet);
          const balance = await contract.GetBalance.call({ symbol: 'ELF', owner: wallet.address });
          console.log(contract, balance, '=====contract');
        }}
      />
      <Button
        title="Transfer"
        onPress={async () => {
          const instance = new AElf(new AElf.providers.HttpProvider(Endpoint));
          const contract = await instance.chain.contractAt('ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx', wallet);
          const req = await contract.Transfer({ symbol: 'ELF', to: wallet.address, amount: 1 });
          setTimeout(async () => {
            try {
              const txr = await instance.chain.getTxResult(req.TransactionId);
              console.log(txr, '=====txr');
            } catch (error) {
              console.log(error, '=====error');
            }
          }, 5000);
        }}
      />
      <WebView source={{ uri: 'https://www.baidu.com/' }} />
    </View>
  );
}