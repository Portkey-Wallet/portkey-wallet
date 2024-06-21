import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import Svg from 'components/Svg';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
interface TokenListItemType {
  currentSymbol?: string;
  currentChainId?: ChainId;
  noBalanceShow?: boolean;
  item: TokenItemShowType;
  onPress?: (item: TokenItemShowType) => void;
  hideBalance?: boolean;
}

const TokenListItem: React.FC<TokenListItemType> = props => {
  const { noBalanceShow = false, onPress, item, currentSymbol, currentChainId, hideBalance = false } = props;
  const { currentNetwork } = useWallet();
  const defaultToken = useDefaultToken();

  const isMainnet = useIsMainnet();
  const symbolImages = useSymbolImages();

  return (
    <Touchable style={itemStyle.wrap} onPress={() => onPress?.(item)}>
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
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.tokenName}>
            {item?.label || item?.symbol}
          </TextL>
          <TextS numberOfLines={1} style={[FontStyles.font11, itemStyle.chainInfo]}>
            {formatChainInfoToShow(item?.chainId, currentNetwork)}
          </TextS>
        </View>

        {!noBalanceShow && (
          <View style={itemStyle.balanceWrap}>
            <TextL style={itemStyle.token} numberOfLines={1} ellipsizeMode={'tail'}>
              {hideBalance ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
            </TextL>
            <TextS numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.dollar}>
              {isMainnet && (hideBalance && item.balanceInUsd ? '****' : formatAmountUSDShow(item.balanceInUsd))}
            </TextS>
          </View>
        )}
        {noBalanceShow && currentSymbol === item?.symbol && currentChainId === item?.chainId && (
          <Svg icon="selected" size={pTd(24)} color={defaultColors.primaryColor} />
        )}
      </View>
    </Touchable>
  );
};

export default memo(TokenListItem);

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
    height: pTd(72),
    marginLeft: pTd(10),
    paddingRight: pTd(16),
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
