import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import TokenItem from './TokenItem';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import Svg from 'components/Svg';
import { TokenItemShowType, ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
interface TokenListItemType {
  item: ITokenSectionResponse;
  onExpand?: (item: ITokenSectionResponse) => void;
  onPress?: (item: TokenItemShowType) => void;
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
            {isMainnet && (
              <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
                {hideBalance && item.balanceInUsd ? '****' : formatAmountUSDShow(item.balanceInUsd)}
              </TextS>
            )}
          </View>
        </View>
        <View style={itemStyle.right}>
          <View style={itemStyle.moreButton}>
            {selected ? <Svg icon="more_selected" size={pTd(20)} /> : <Svg icon="more_normal" size={pTd(20)} />}
          </View>
        </View>
      </Touchable>
      {selected &&
        item.tokens?.map((token, index) => (
          <TokenItem
            key={index}
            item={token}
            onPress={onPress}
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
  right: {
    marginRight: pTd(14),
    marginLeft: pTd(12),
  },
  moreButton: {
    borderRadius: pTd(4),
    overflow: 'hidden',
  },
  middle: {
    height: pTd(72),
    marginLeft: pTd(10),
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
    lineHeight: pTd(24),
  },
  chainInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
    height: pTd(20),
    width: pTd(150),
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    color: defaultColors.font5,
    lineHeight: pTd(24),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
    height: pTd(20),
    color: defaultColors.font11,
  },
});
