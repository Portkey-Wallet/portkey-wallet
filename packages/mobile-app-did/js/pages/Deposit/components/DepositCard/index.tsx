import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Image, StyleProp, ViewStyle, TextInput } from 'react-native';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

type DepositCardType = 'From' | 'To';

interface DepositCardProps {
  wrapStyle?: StyleProp<ViewStyle>;
  type: DepositCardType;
  chainId: string;
  chainName: string;
  chainIcon: string;
  tokenName: string;
  tokenIcon: string;
}

export const DepositCard: React.FC<DepositCardProps> = ({
  wrapStyle,
  type,
  chainIcon,
  chainName,
  tokenIcon,
  tokenName,
}) => {
  return (
    <View style={[styles.container, wrapStyle]}>
      <View style={styles.chainWrapper}>
        <Text style={styles.typeText}>{type}</Text>
        <Image style={styles.chainIconImage} source={{ uri: chainIcon }} />
        <Text style={styles.chainNameText}>{chainName}</Text>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.tokenWrapper}>
          <Image style={styles.tokenIconImage} source={{ uri: tokenIcon }} />
          <Text style={styles.tokenText}>{tokenName}</Text>
          <Svg iconStyle={styles.arrowIcon} size={pTd(12)} icon={'down-arrow'} />
        </View>
        <View style={styles.mountWrapper}>
          <Text style={styles.mountDesc}>{type === 'From' ? 'You Pay' : 'You Receive'}</Text>
          {type === 'From' ? <TextInput style={styles.mountTextInput} /> : <Text style={styles.mountText}>100</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg33,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(20),
  },
  chainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    color: defaultColors.font11,
    fontSize: pTd(12),
  },
  chainIconImage: {
    marginLeft: pTd(8),
    width: pTd(16),
    height: pTd(16),
    borderRadius: pTd(8),
  },
  chainNameText: {
    marginLeft: pTd(4),
    color: defaultColors.font5,
    fontSize: pTd(12),
  },
  contentWrapper: {
    marginTop: pTd(20),
    height: pTd(46),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tokenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIconImage: {
    width: pTd(28),
    height: pTd(28),
    borderRadius: pTd(14),
  },
  tokenText: {
    marginLeft: pTd(8),
    color: defaultColors.font5,
    fontSize: pTd(20),
    ...fonts.mediumFont,
  },
  arrowIcon: {
    marginLeft: pTd(12),
  },
  mountWrapper: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: pTd(20),
  },
  mountText: {
    color: defaultColors.font5,
    fontSize: pTd(20),
    ...fonts.mediumFont,
  },
  mountTextInput: {
    marginTop: pTd(2),
    width: '100%',
    color: defaultColors.font5,
    fontSize: pTd(20),
    ...fonts.mediumFont,
    textAlign: 'right',
  },
  mountDesc: {
    fontSize: pTd(12),
    color: defaultColors.font11,
  },
});
