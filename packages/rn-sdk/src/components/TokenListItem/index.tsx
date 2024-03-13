import React from 'react';
import { divDecimals, formatAmountShow } from 'packages/utils/converter';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatChainInfoToShow } from 'packages/utils';
import { pTd } from 'utils/unit';
import { CommonInfo } from '../TokenOverlay/hooks';
import { BigNumber } from 'bignumber.js';
interface TokenListItemType {
  noBalanceShow?: boolean;
  item?: any;
  onPress?: (item: any) => void;
  commonInfo: CommonInfo;
}

const TokenListItem: React.FC<TokenListItemType> = props => {
  const { noBalanceShow = false, onPress, item } = props;
  const { symbolImages, currentNetwork, defaultToken } = props.commonInfo;
  const symbol = item?.token?.symbol ?? item.symbol;
  const chainId = item?.token?.chainId ?? item.chainId;
  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)} disabled={!onPress}>
      <CommonAvatar
        hasBorder
        style={itemStyle.left}
        title={symbol}
        avatarSize={pTd(48)}
        // elf token icon is fixed , only use white background color
        svgName={symbol === defaultToken.symbol ? 'testnet' : undefined}
        imageUrl={symbolImages[symbol]}
      />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.tokenName}>
            {symbol}
          </TextL>
          <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.chainInfo]}>
            {formatChainInfoToShow(chainId, currentNetwork)}
          </TextS>
        </View>

        {!noBalanceShow && (
          <View style={itemStyle.balanceWrap}>
            <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>
              {formatAmountShow(divDecimals(item?.balance, item.decimals))}
            </TextL>
            <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
              {!(currentNetwork === 'TESTNET') &&
                `$ ${(BigNumber(item?.balanceInUsd ?? 0) ?? BigNumber(0)).toFixed(2)}`}
            </TextS>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TokenListItem;

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tokenName: {
    lineHeight: pTd(22),
  },
  chainInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
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
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
    color: defaultColors.font7,
  },
});
