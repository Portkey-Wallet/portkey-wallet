import React from 'react';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

import LinearGradient from 'react-native-linear-gradient';

export const PortkeyLinearGradient = () => (
  <LinearGradient
    start={{ x: 0, y: 0.15 }}
    end={{ x: 1, y: 0.15 }}
    colors={['#f5f5f5', '#f3f3f3', '#f5f5f5']}
    style={styles.container}
  />
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: -pTd(2),
    right: -pTd(2),
    top: -pTd(2),
    bottom: -pTd(2),
    zIndex: -1,
  },
});
