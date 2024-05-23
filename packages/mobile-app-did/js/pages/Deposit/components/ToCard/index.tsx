import React from 'react';
import { StyleSheet, View, Text, Image, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

interface ToCardProps {
  wrapStyle?: StyleProp<ViewStyle>;
  chainName: string;
  chainIcon: string;
  tokenSymbol: string;
  tokenIcon: string;
  receiveAmount: number;
  minumumReceiveAmount: number;
  showAmount: boolean;
  onPress: () => void;
}

export const ToCard: React.FC<ToCardProps> = ({
  wrapStyle,
  chainIcon,
  chainName,
  tokenIcon,
  tokenSymbol,
  receiveAmount,
  minumumReceiveAmount,
  showAmount,
  onPress,
}) => {
  return (
    <View style={[styles.container, wrapStyle]}>
      <View style={styles.chainWrapper}>
        <Text style={styles.typeText}>To</Text>
        <Image style={styles.chainIconImage} source={{ uri: chainIcon }} />
        <Text style={styles.chainNameText}>{chainName}</Text>
      </View>
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.tokenWrapper} onPress={onPress}>
          {tokenIcon && <Image style={styles.tokenIconImage} source={{ uri: tokenIcon }} />}
          <Text style={styles.tokenText}>{tokenSymbol}</Text>
          <Svg iconStyle={styles.arrowIcon} size={pTd(12)} icon={'down-arrow'} />
        </TouchableOpacity>
        {showAmount && (
          <View style={styles.amountWrapper}>
            <Text style={styles.amountDesc}>{'You Receive'}</Text>
            <Text style={receiveAmount > 0 ? styles.amountText : styles.placeholderText}>
              {receiveAmount > 0 ? receiveAmount : '0.00'}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.minimumAmountText}>
        {showAmount && minumumReceiveAmount > 0 ? `Minimum receive: ${minumumReceiveAmount}` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg33,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(12),
    paddingTop: pTd(20),
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
  amountWrapper: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: pTd(20),
  },
  amountText: {
    color: defaultColors.font5,
    fontSize: pTd(20),
    ...fonts.mediumFont,
  },
  amountDesc: {
    fontSize: pTd(12),
    color: defaultColors.font11,
  },
  minimumAmountText: {
    width: '100%',
    marginBottom: pTd(4),
    color: defaultColors.font11,
    lineHeight: pTd(16),
    fontSize: pTd(12),
    textAlign: 'right',
  },
  placeholderText: {
    color: defaultColors.font11,
    fontSize: pTd(20),
    ...fonts.mediumFont,
  },
});
