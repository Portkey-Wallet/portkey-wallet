import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { darkColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';

interface TokenListItemType {
  item: TokenItemShowType;
  onPress?: (item: TokenItemShowType) => void;
  hideBalance?: boolean;
  showTopSeparator?: boolean;
}

const TokenItem: React.FC<TokenListItemType> = props => {
  const { onPress, item, hideBalance = false, showTopSeparator } = props;
  const { currentNetwork } = useWallet();

  return (
    <Touchable style={[itemStyle.wrap, showTopSeparator && { marginTop: pTd(4) }]} onPress={() => onPress?.(item)}>
      <View style={itemStyle.left}>
        <CommonAvatar
          hasBorder
          title={item?.symbol}
          avatarSize={pTd(36)}
          imageUrl={item?.imageUrl}
          titleStyle={FontStyles.font11}
          borderStyle={GStyles.hairlineBorder}
        />
        <View>
          <TextM style={itemStyle.symbolText}>{item.label || item.symbol}</TextM>
          <TextM style={itemStyle.chainText}>{formatChainInfoToShow(item.chainId, currentNetwork)}</TextM>
        </View>
      </View>
      <View style={itemStyle.right}>
        <TextM style={itemStyle.balanceText}>
          {hideBalance ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
        </TextM>
        {item.balanceInUsd && (
          <TextM style={itemStyle.balanceInUseText}>{hideBalance ? '****' : item.balanceInUsd}</TextM>
        )}
      </View>
    </Touchable>
  );
};

export default memo(TokenItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(48),
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
  symbolText: {
    fontSize: pTd(16),
    marginLeft: pTd(8),
    color: darkColors.textBase1,
  },
  chainText: {
    fontSize: pTd(14),
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
    color: darkColors.textBase1,
  },
  balanceInUseText: {
    color: darkColors.textBase2,
  },
});
