import React from 'react';
import Svg from 'components/Svg';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';

export default function HeaderCard() {
  return (
    <View style={styles.container}>
      <Svg icon="gift-box-close" oblongSize={[pTd(171.5), pTd(120)]} />
      <View style={styles.titlWrapper}>
        <Svg icon="success" size={pTd(20)} iconStyle={styles.icon} />
        <TextL style={{ ...fonts.mediumFont }}>“Claim and Join Portkey”</TextL>
      </View>
      <TouchableOpacity>
        <TextM style={[FontStyles.brandNormal, GStyles.marginTop(pTd(8))]}>View Details</TextM>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  titlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: pTd(8),
  },
});
