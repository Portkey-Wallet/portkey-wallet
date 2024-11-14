import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { darkColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM } from 'components/CommonText';
import TokenItem from './TokenItem';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';

interface TokenListItemType {
  item: ITokenSectionResponse;
  onExpand?: (item: ITokenSectionResponse) => void;
  onPress?: (item: ITokenSectionResponse, index: number) => void;
  selected?: boolean;
  hideBalance?: boolean;
}

const TokenListUnionItem: React.FC<TokenListItemType> = props => {
  const { onPress, onExpand, selected, item, hideBalance = false } = props;

  const isMainnet = useIsMainnet();
  const symbolImages = useSymbolImages();

  const chainIcon = useMemo(() => {
    if (!item.tokens || item.tokens.length === 0) {
      return undefined;
    } else if (item.tokens?.length === 1) {
      return item.tokens[0].chainImageUrl;
    } else {
      return undefined;
    }
  }, [item.tokens]);

  return (
    <View>
      <Touchable style={itemStyle.wrap} onPress={() => onExpand?.(item)}>
        <View style={itemStyle.iconWrap}>
          <CommonAvatar
            hasBorder
            style={itemStyle.tokenIcon}
            title={item?.symbol}
            avatarSize={pTd(40)}
            imageUrl={item?.imageUrl || symbolImages[item?.symbol]}
            titleStyle={FontStyles.font11}
            borderStyle={GStyles.hairlineBorder}
          />
          <CommonAvatar
            hasBorder
            style={itemStyle.chainIcon}
            title={item.tokens?.length + ''}
            avatarSize={pTd(20)}
            imageUrl={chainIcon}
            titleStyle={itemStyle.tokenIconTitle}
            borderStyle={itemStyle.iconBorder}
          />
        </View>
        <View style={itemStyle.middle}>
          <View style={itemStyle.infoWrap}>
            <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.tokenName}>
              {item?.label || item?.symbol}
            </TextL>
            {isMainnet && typeof item.price === 'number' && item.price > 0 && (
              <TextM numberOfLines={1} style={[FontStyles.font11, itemStyle.chainInfo]}>
                {'$' + item.price}
              </TextM>
            )}
          </View>

          <View style={itemStyle.balanceWrap}>
            <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>
              {hideBalance ? '******' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
            </TextL>
            {isMainnet && item.balanceInUsd && (
              <TextM numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
                {hideBalance ? '******' : formatAmountUSDShow(item.balanceInUsd)}
              </TextM>
            )}
          </View>
        </View>
      </Touchable>
      {selected &&
        item.tokens?.map((token, index) => (
          <TokenItem
            key={index}
            item={token}
            onPress={() => {
              onPress && onPress(item, index);
            }}
            hideBalance={hideBalance}
          />
        ))}
    </View>
  );
};

export default memo(TokenListUnionItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(64),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    marginLeft: pTd(16),
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  iconBorder: {
    borderColor: darkColors.borderBase1,
  },
  tokenIconTitle: {
    fontSize: pTd(10),
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  middle: {
    height: pTd(72),
    marginLeft: pTd(10),
    marginRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tokenName: {
    color: darkColors.textBase1,
    lineHeight: pTd(22),
  },
  chainInfo: {
    lineHeight: pTd(20),
    height: pTd(20),
    width: pTd(150),
    fontSize: pTd(14),
    color: darkColors.textBase2,
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    color: darkColors.textBase1,
    lineHeight: pTd(16),
    overflow: 'hidden',
    ...fonts.SGMediumFont,
  },
  dollar: {
    marginTop: pTd(6),
    lineHeight: pTd(20),
    height: pTd(20),
    fontSize: pTd(14),
    color: darkColors.textBase2,
  },
});
