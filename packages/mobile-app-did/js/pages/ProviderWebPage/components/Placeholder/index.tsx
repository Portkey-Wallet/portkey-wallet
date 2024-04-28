import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';

const Placeholder = ({ dappName, icon }: { dappName: string; icon?: IconName }) => {
  return (
    <View style={styles.container}>
      {icon ? <Svg icon={icon || 'eBridgeFavIcon'} size={64} iconStyle={styles.icon} /> : <View style={styles.icon} />}
      <TextL style={[styles.title, fonts.mediumFont]}>{`Redirecting to ${dappName} `}</TextL>
      <Text style={styles.desc}>
        Please exercise caution and protect your asset security while navigating third-party dApps.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: defaultColors.white,
    alignItems: 'center',
    position: 'absolute',
  },
  icon: {
    marginTop: pTd(160),
    borderRadius: 32,
  },
  title: {
    color: defaultColors.font16,
    fontWeight: '500',
    marginTop: pTd(32),
  },
  desc: {
    marginTop: pTd(8),
    marginHorizontal: pTd(16),
    color: defaultColors.font11,
    textAlign: 'center',
  },
});

export default Placeholder;
