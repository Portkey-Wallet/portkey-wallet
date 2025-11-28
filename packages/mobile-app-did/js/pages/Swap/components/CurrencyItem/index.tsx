import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { darkColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import fonts from 'assets/theme/fonts';
import { ViewStyleType, TextStyleType } from 'types/styles';
import { TCurrency } from '@portkey-wallet/types/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { useTheme } from '@rneui/themed';

export type TCurrencyItem = {
  wrapStyle?: ViewStyleType;
  balanceTextStyle?: TextStyleType;
  balanceInUseTextStyle?: TextStyleType;
  item: TCurrency;
  onPress?: (item: TCurrency) => void;
  hideBalance?: boolean;
  balance?: string;
  balanceInUsd?: string;
};

const CurrencyItem: React.FC<TCurrencyItem> = props => {
  const {
    onPress,
    item,
    hideBalance = false,
    wrapStyle,
    balanceTextStyle,
    balanceInUseTextStyle,
    balance,
    balanceInUsd,
  } = props;
  const isMainnet = useIsMainnet();
  const { theme } = useTheme();
  return (
    <Touchable style={[itemStyle.wrap, wrapStyle]} onPress={() => onPress?.(item)}>
      <View style={itemStyle.left}>
        <View style={itemStyle.iconWrap}>
          <CommonAvatar
            style={itemStyle.tokenIcon}
            title={item?.symbol}
            avatarSize={pTd(40)}
            imageUrl={item?.imageUrl}
            titleStyle={{ color: theme.colors.textNeutral3 }}
          />
          <CommonAvatar
            hasBorder={true}
            style={itemStyle.chainIcon}
            title={item?.displayChainName}
            avatarSize={pTd(20)}
            imageUrl={item?.chainImageUrl}
            borderStyle={itemStyle.tokenIconBorder}
          />
        </View>
        <View>
          <TextM numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.symbolText}>
            {formatNameWithNoUnderline(item.label || item.symbol)}
          </TextM>
          {item.displayChainName && (
            <TextM numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.chainText}>
              {item.displayChainName}
            </TextM>
          )}
        </View>
      </View>
      <View style={itemStyle.right}>
        <TextM numberOfLines={1} ellipsizeMode={'tail'} style={[itemStyle.balanceText, balanceTextStyle]}>
          {hideBalance ? '******' : balance ? balance : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
        </TextM>
        {(balanceInUsd || item.balanceInUsd) && isMainnet && (
          <TextM numberOfLines={1} ellipsizeMode={'tail'} style={[itemStyle.balanceInUseText, balanceInUseTextStyle]}>
            {hideBalance ? '******' : balanceInUsd ? balanceInUsd : item.balanceInUsd}
          </TextM>
        )}
      </View>
    </Touchable>
  );
};

export default memo(CurrencyItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: pTd(8),
    marginHorizontal: pTd(16),
    paddingLeft: pTd(16),
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tokenIconBorder: {
    borderWidth: pTd(1),
    borderColor: darkColors.borderBase1,
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: pTd(1),
    borderColor: darkColors.borderBase1,
  },
  symbolText: {
    fontSize: pTd(16),
    lineHeight: pTd(22),
    marginLeft: pTd(8),
    color: darkColors.textBase1,
  },
  chainText: {
    fontSize: pTd(14),
    lineHeight: pTd(20),
    marginLeft: pTd(8),
    color: darkColors.textBase2,
  },
  right: {
    marginLeft: pTd(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: pTd(16),
    lineHeight: pTd(16),
    color: darkColors.textBase1,
    ...fonts.SGMediumFont,
  },
  balanceInUseText: {
    fontSize: pTd(14),
    lineHeight: pTd(20),
    color: darkColors.textBase2,
    marginTop: pTd(6),
  },
});
