import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const MintStatusLine = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mint NFTs for free!</Text>
      <View style={styles.mintNowContainer}>
        <Text style={styles.mintNowText}>Mint Now</Text>
        <Svg icon="right-arrow" color={defaultColors.brandNormal} size={pTd(14)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: pTd(16),
    marginRight: pTd(16),
    paddingLeft: pTd(12),
    paddingRight: pTd(12),
    paddingTop: pTd(13),
    paddingBottom: pTd(13),
    width: screenWidth - pTd(32),
    backgroundColor: defaultColors.neutralContainerBG,
    borderRadius: pTd(8),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#101114',
    fontSize: pTd(14),
    fontWeight: '500',
    lineHeight: pTd(22),
  },
  mintNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mintNowText: {
    color: '#5D42FF',
    fontSize: pTd(14),
    fontWeight: '500',
    lineHeight: pTd(22),
  },
});

export default MintStatusLine;
