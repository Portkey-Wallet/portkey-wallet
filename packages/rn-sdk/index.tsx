import React from 'react';
import { AppRegistry, ComponentProvider, StyleSheet, Text, View } from 'react-native';
import { PortkeyEntries } from './js/config/entries';
import TestPage from './js/components/TestPage';
import { initJSModules } from './js/service/js-modules';

type EntryConfig = Map<string, ComponentProvider>;

const entryConfig: EntryConfig = new Map();
entryConfig.set(PortkeyEntries.TEST, () => TestPage);

for (const [key, value] of entryConfig) {
  AppRegistry.registerComponent(key, value);
}

initJSModules();
