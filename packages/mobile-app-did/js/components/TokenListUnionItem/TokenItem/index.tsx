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
        <TextM style={itemStyle.chainText}>{formatChainInfoToShow(item.chainId, currentNetwork)}</TextM>
      </View>
      <View style={itemStyle.right}>
        <TextM style={itemStyle.balanceText}>
          {hideBalance ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
        </TextM>
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
    paddingHorizontal: pTd(12),
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainText: {
    marginLeft: pTd(8),
    color: darkColors.textBase2,
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    color: darkColors.textBase1,
  },
});
