import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SetPinFake() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Pin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
