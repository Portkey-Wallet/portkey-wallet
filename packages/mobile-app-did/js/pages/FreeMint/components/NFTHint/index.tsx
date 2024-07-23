import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useAppNFTTabShow } from 'hooks/cms';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabRouteNameEnum } from 'types/navigate';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

const NFTHint = () => {
  const { isNFTTabShow } = useAppNFTTabShow();
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Get your own NFTs to start</Text>
      <View style={styles.row}>
        <View style={styles.numberBox}>
          <Text style={styles.numberText}>1</Text>
        </View>
        <View style={styles.rowContent}>
          <Touchable
            onPress={() => {
              navigationService.navigate('FreeMintHome');
            }}>
            <Text style={styles.mainText}>Free Mint</Text>
          </Touchable>
          <Svg icon="right-arrow" color={defaultColors.brandNormal} size={pTd(14)} />
        </View>
      </View>
      {isNFTTabShow && (
        <View style={styles.row}>
          <View style={styles.numberBox}>
            <Text style={styles.numberText}>2</Text>
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.mainText, styles.primaryText]}>
              Buy on NFT marketplace -{' '}
              <Touchable
                onPress={() => {
                  navigationService.navToBottomTab(TabRouteNameEnum.TRADE, { initTab: 'NFT' });
                }}>
                <Text style={styles.highlightText}>Forest</Text>
              </Touchable>
            </Text>
            <Svg icon="right-arrow" color={defaultColors.brandNormal} size={pTd(14)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: pTd(16),
    marginRight: pTd(16),
    padding: pTd(12),
    height: pTd(110),
    width: screenWidth - pTd(32),
    backgroundColor: defaultColors.neutralContainerBG,
    borderRadius: pTd(8),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerText: {
    color: defaultColors.neutralTertiaryText,
    fontSize: pTd(14),
    fontWeight: '400',
    lineHeight: pTd(22),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: pTd(10),
  },
  numberBox: {
    width: pTd(18),
    height: pTd(18),
    backgroundColor: defaultColors.neutralDivider,
    borderRadius: pTd(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    textAlign: 'center',
    color: defaultColors.neutralSecondaryTextColor,
    fontSize: pTd(12),
    fontWeight: '400',
    lineHeight: pTd(16),
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: pTd(8),
  },
  mainText: {
    color: defaultColors.brandNormal,
    fontSize: pTd(14),
    fontWeight: '500',
    lineHeight: pTd(22),
  },
  highlightText: {
    color: defaultColors.brandNormal,
  },
  primaryText: {
    color: defaultColors.primaryTextColor,
  },
});

export default NFTHint;
