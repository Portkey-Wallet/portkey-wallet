import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { portkey } from '@portkey/react-native-sdk';
import 'react-native-get-random-values';

function MyButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
const PortkeyUIManagerService = [
  ['login'],
  ['openAssetsDashboard'],
  ['guardiansManager'],
  ['settingsManager'],
  ['scanQRCodeManager'],
  ['paymentSecurityManager'],
  ['unlockWallet'],
];
const PortkeyAccountService = [
  ['callCaContractMethod', 'GetVerifierServers', true],
  ['getWalletInfo'],
  ['getWalletState'],
  ['lockWallet'],
  ['exitWallet'],
];
function App() {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <MyButton title="PortkeyUIManagerService" onPress={() => setModalVisible1(true)} />
      </View>
      <MyButton title="PortkeyAccountService" onPress={() => setModalVisible2(true)} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible1(false)}>
          <View style={styles.mask} />
        </TouchableWithoutFeedback>
        <View style={styles.modalView}>
          {PortkeyUIManagerService.map((value, i) => (
            <View key={i} style={styles.buttonContainer}>
              <MyButton
                title={`Call Method: ${value[0]}`}
                onPress={() => {
                  portkey[value[0]]
                    .apply(portkey, value.slice(1))
                    .then(res => {
                      console.log('res', res);
                    })
                    .catch(error => {
                      console.log('error', error);
                    })
                    .finally(() => {
                      console.log('over!');
                    });
                }}
              />
            </View>
          ))}
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible2(false)}>
          <View style={styles.mask} />
        </TouchableWithoutFeedback>
        <View style={styles.modalView}>
          {PortkeyAccountService.map((value, i) => (
            <View key={i} style={styles.buttonContainer}>
              <MyButton
                title={`Call Method: ${value[0]}`}
                onPress={() => {
                  portkey[value[0] as string]
                    .apply(portkey, value.slice(1))
                    .then(res => {
                      console.log('res', res);
                    })
                    .catch(error => {
                      console.log('error', error);
                    })
                    .finally(() => {
                      console.log('over!');
                    });
                }}
              />
            </View>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'none',
  },
});

export default App;
