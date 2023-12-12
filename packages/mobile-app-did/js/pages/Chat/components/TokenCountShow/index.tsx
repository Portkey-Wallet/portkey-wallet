import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TokenCountShowPropsType = {
  number: string;
  symbol: string;
};

export default function TokenCountShow(props: TokenCountShowPropsType) {
  const { number, symbol } = props;

  return (
    <View>
      <Text style={styles.num}>{number}</Text>
      <Text>{symbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  num: {
    width: '100%',
  },
});
