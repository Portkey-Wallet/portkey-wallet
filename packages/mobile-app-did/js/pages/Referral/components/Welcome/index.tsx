import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import { TextL, TextXXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { StyleSheet, View } from 'react-native';
export default function Welcome() {
  return (
    <View style={styles.container}>
      <Svg iconStyle={styles.iconStyle} size={100} icon="logo-icon" color={defaultColors.bg1} />
      <TextXXXL style={styles.title}>Welcome to Portkey</TextXXXL>
      <TextL style={styles.tip}>Your key to play and earn in Web 3</TextL>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  iconStyle: {
    marginTop: windowHeight * 0.28,
  },
  title: {
    marginTop: windowHeight * 0.08,
    fontWeight: '400',
    color: defaultColors.font11,
  },
  tip: {
    marginTop: 8,
    color: defaultColors.font11,
    opacity: 0.8,
  },
});
