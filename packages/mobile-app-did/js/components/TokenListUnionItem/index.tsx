import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { darkColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import TokenItem from './TokenItem';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
interface TokenListItemType {
  item: ITokenSectionResponse;
  onExpand?: (item: ITokenSectionResponse) => void;
  onPress?: (item: ITokenSectionResponse, index: number) => void;
  selected?: boolean;
  hideBalance?: boolean;
}

const TokenListUnionItem: React.FC<TokenListItemType> = props => {
  const { onPress, onExpand, selected, item, hideBalance = false } = props;
  const defaultToken = useDefaultToken();

  const isMainnet = useIsMainnet();
  const symbolImages = useSymbolImages();

  return (
    <View>
      <Touchable style={itemStyle.wrap} onPress={() => onExpand?.(item)}>
        <CommonAvatar
          hasBorder
          style={itemStyle.left}
          title={item?.symbol}
          avatarSize={pTd(36)}
          // elf token icon is fixed , only use white background color
          svgName={item?.symbol === defaultToken.symbol ? 'testnet' : undefined}
          imageUrl={item?.imageUrl || symbolImages[item?.symbol]}
          titleStyle={FontStyles.font11}
          borderStyle={GStyles.hairlineBorder}
        />
        <View style={itemStyle.middle}>
          <View style={itemStyle.infoWrap}>
            <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.tokenName}>
              {item?.label || item?.symbol}
            </TextL>
            {isMainnet && typeof item.price === 'number' && item.price > 0 && (
              <TextS numberOfLines={1} style={[FontStyles.font11, itemStyle.chainInfo]}>
                {'$' + item.price}
              </TextS>
            )}
          </View>

          <View style={itemStyle.balanceWrap}>
            <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>
              {hideBalance ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
            </TextL>
            {isMainnet && item.balanceInUsd && (
              <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
                {hideBalance ? '****' : formatAmountUSDShow(item.balanceInUsd)}
              </TextS>
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
            showTopSeparator={index > 0}
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
  left: {
    marginLeft: pTd(16),
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
    lineHeight: pTd(24),
  },
  chainInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
    height: pTd(20),
    width: pTd(150),
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
    lineHeight: pTd(24),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
    height: pTd(20),
    color: darkColors.textBase2,
  },
});
