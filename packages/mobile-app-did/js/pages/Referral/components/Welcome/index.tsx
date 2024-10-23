import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import { TextH1 } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
export default function Welcome() {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Svg
        iconStyle={styles.iconStyle}
        oblongSize={[pTd(104), pTd(24)]}
        icon="logo-icon-text"
        color={defaultColors.bg1}
      />
      <TextH1 style={styles.title}>Your Gateway to the World of Web3</TextH1>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: pTd(16),
  },
  iconStyle: {
    marginTop: pTd(32),
  },
  title: {
    marginTop: pTd(24),
    color: theme.colors.textBase1,
  },
}));
