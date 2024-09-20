import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import Svg from 'components/Svg';
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
      <TextM style={itemStyle.chainText}>{formatChainInfoToShow(item.chainId, currentNetwork)}</TextM>
      <View style={itemStyle.right}>
        <TextM style={itemStyle.balanceText}>
          {hideBalance ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
        </TextM>
        <Svg icon="token_list_item_right" size={pTd(16)} />
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
    backgroundColor: defaultColors.neutralContainerBG,
    borderRadius: pTd(8),
    marginHorizontal: pTd(16),
    paddingHorizontal: pTd(12),
  },
  chainText: {
    color: defaultColors.font18,
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    color: defaultColors.primaryTextColor,
  },
});
