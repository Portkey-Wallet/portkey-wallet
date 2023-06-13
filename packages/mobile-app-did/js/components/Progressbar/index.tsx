import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

interface ProgressbarProps {
  percentage: number;
}

export function Progressbar(props: ProgressbarProps) {
  const { percentage } = props;

  return <View style={styles.progressBar} />;
}

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: pTd(40),
  },
});
