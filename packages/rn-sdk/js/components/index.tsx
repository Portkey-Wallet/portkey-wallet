import React from 'react';
import { AppRegistry, ComponentProvider, StyleSheet, Text, View } from 'react-native';
import { PortkeyEntries } from '../config/entries';
import EntryPage from './entries/EntryPage';
import LoginPage from './entries/LoginPage';
import GuardianPage from './entries/GuardianPage';

const Root = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Hello, Portkey!!!</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
    margin: 10,
    backgroundColor: 'yellow',
  },
});

type EntryConfig = Map<string, ComponentProvider>;

const entryConfig: EntryConfig = new Map();
entryConfig.set(PortkeyEntries.ROOT, () => Root);
entryConfig.set(PortkeyEntries.ENTRY, () => EntryPage);
entryConfig.set(PortkeyEntries.LOGIN, () => LoginPage);
entryConfig.set(PortkeyEntries.GUARDIAN, () => GuardianPage);

for (const [key, value] of entryConfig) {
  AppRegistry.registerComponent(key, value);
}
