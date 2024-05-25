import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Svg from 'components/Svg';
import { getNetworkImagePath } from 'components/Selects/SelectToken';
import CommonAvatar from 'components/CommonAvatar';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { formatSymbolDisplay } from '@portkey-wallet/utils/format';

interface FromCardProps {
  wrapStyle?: StyleProp<ViewStyle>;
  network: string;
  networkName: string;
  tokenSymbol: string;
  tokenIcon: string;
  onChangeText: (text: string) => void;
  onPress: () => void;
  showAmount: boolean;
}

export const FromCard: React.FC<FromCardProps> = ({
  wrapStyle,
  network,
  networkName,
  tokenIcon,
  tokenSymbol,
  onChangeText,
  onPress,
  showAmount,
}) => {
  const networkIcon = (iconStyle: ImageStyle) => {
    const icon = getNetworkImagePath(network);
    if (icon) {
      return <Image style={iconStyle} source={icon} resizeMode={'contain'} />;
    } else {
      return (
        <CommonAvatar
          title={networkName}
          avatarSize={pTd(20)}
          hasBorder
          titleStyle={{
            fontSize: pTd(14),
          }}
        />
      );
    }
  };

  return (
    <View style={[styles.container, wrapStyle]}>
      <TouchableOpacity style={styles.chainWrapper} onPress={onPress} activeOpacity={1}>
        <Text style={styles.typeText}>From</Text>
        {network && networkIcon(styles.chainIconImage)}
        <Text style={styles.chainNameText}>{networkName}</Text>
      </TouchableOpacity>
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.tokenWrapper} onPress={onPress} activeOpacity={1}>
          {tokenIcon && <Image style={styles.tokenIconImage} source={{ uri: tokenIcon }} />}
          <Text style={styles.tokenText}>{formatSymbolDisplay(tokenSymbol)}</Text>
          <Svg iconStyle={styles.arrowIcon} size={pTd(10)} icon={'solid-down-arrow'} />
        </TouchableOpacity>
        {showAmount && (
          <View style={styles.mountWrapper}>
            <Text style={styles.mountDesc}>{'You Pay'}</Text>
            <TextInput
              style={styles.mountTextInput}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={defaultColors.font11}
              onChangeText={onChangeText}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg33,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(12),
    paddingTop: pTd(14),
    paddingBottom: pTd(20),
  },
  chainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(28),
  },
  typeText: {
    color: defaultColors.font11,
    fontSize: pTd(12),
    marginRight: pTd(8),
  },
  chainIconImage: {
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
    flex: 1,
    height: '100%',
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
    marginLeft: pTd(12),
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
