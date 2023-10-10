import React, { useState } from 'react';
import 'react-native-get-random-values';
import { View, Text, TouchableOpacityProps, TouchableOpacity, StyleSheet } from 'react-native';
import AElf from 'aelf-sdk';
import { NetworkController } from 'network/controller';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { setPin } from 'pages/Pin/core';
import { CheckPinResult } from 'pages/Pin/check-pin';

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
const Endpoint = 'https://tdvw-test-node.aelf.io';
export default function Screen(props: any) {
  const { navigateForResult } = useBaseContainer({
    rootTag: props.rootTag,
    entryName: 'test',
  });
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
      <Button
        title="GetCountryCodeData"
        onPress={() => {
          NetworkController.getCountryCodeInfo().then(data => console.warn(data, '=====data'));
        }}
      />
      <Button
        title="SetPinTo:123456"
        onPress={() => {
          setPin('123456');
        }}
      />
      <Button
        title="GoToSetPin"
        onPress={() => {
          navigateForResult<CheckPinResult>(
            PortkeyEntries.CHECK_PIN,
            {
              params: {
                openBiometrics: false,
              },
            },
            result => {
              console.warn('navigate back , status : ' + result.status + ' , data : ' + JSON.stringify(result.data));
            },
          );
        }}
      />
      <Button
        title="GoToLogin"
        onPress={() => {
          navigateForResult<unknown, any>(PortkeyEntries.REFERRAL_ENTRY, {}, res => {
            console.warn('navigate back , status : ' + res.status + ' , data : ' + JSON.stringify(res.data));
          });
        }}
      />
    </View>
  );
}
