import React from 'react';
import { StyleSheet, View, Text, Image, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { formatSymbolDisplay } from '@portkey-wallet/utils/format';

interface ToCardProps {
  wrapStyle?: StyleProp<ViewStyle>;
  chainName: string;
  tokenSymbol: string;
  tokenIcon: string;
  receiveAmount: number;
  minumumReceiveAmount: number;
  showAmount: boolean;
  onPress: () => void;
}

export const ToCard: React.FC<ToCardProps> = ({
  wrapStyle,
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
      <TouchableOpacity style={styles.chainWrapper} onPress={onPress} activeOpacity={1}>
        <Text style={styles.typeText}>To</Text>
        <Image style={styles.chainIconImage} source={require('assets/image/pngs/aelf.png')} />
        <Text style={styles.chainNameText}>{chainName}</Text>
      </TouchableOpacity>
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.tokenWrapper} onPress={onPress} activeOpacity={1}>
          {tokenIcon && <Image style={styles.tokenIconImage} source={{ uri: tokenIcon }} />}
          <Text style={styles.tokenText}>{formatSymbolDisplay(tokenSymbol)}</Text>
          <Svg iconStyle={styles.arrowIcon} size={pTd(10)} icon={'solid-down-arrow'} />
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
    paddingTop: pTd(14),
  },
  chainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(28),
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
    marginTop: pTd(14),
    height: pTd(46),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tokenWrapper: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginLeft: pTd(12),
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
