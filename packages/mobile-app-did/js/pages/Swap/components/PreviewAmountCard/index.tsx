import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import TokenItem from 'components/TokenListUnionItem/TokenItem';
import Svg, { IconName } from 'components/Svg';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { useTheme } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';

interface IAmountRowItem {
  symbol: string;
  value: string;
  decimals: string;
  valueInUsd: string;
  svgName: IconName;
}

interface IAmountRowProps {
  item: IAmountRowItem;
}

interface IPreviewAmountCardProps {
  style?: ViewStyleType;
}

const AmountRow = ({ item }: IAmountRowProps) => {
  const styles = getStyles();

  const tokenItem = useMemo(() => {
    return {
      symbol: item.symbol,
      balance: item.value,
      decimals: item.decimals,
      balanceInUsd: item.valueInUsd,
      svgName: item.svgName,
      chainSvgName: 'sideChain',
    } as unknown as TokenItemShowType;
  }, [item]);

  return (
    <TokenItem
      wrapStyle={styles.tokenItem}
      balanceTextStyle={styles.balanceTextStyle}
      balanceInUseTextStyle={styles.balanceInUseTextStyle}
      item={tokenItem}
    />
  );
};

const PreviewAmountCard = ({ style }: IPreviewAmountCardProps) => {
  const styles = getStyles();
  const { theme } = useTheme();

  const payItem = {
    symbol: 'ELF',
    value: '7850000000',
    decimals: '8',
    valueInUsd: '$25.81865',
    svgName: 'elf-icon',
  } as IAmountRowItem;

  const receiveItem = {
    symbol: 'USDT',
    value: '7850000000',
    decimals: '8',
    valueInUsd: '$25.81865',
    svgName: 'usdt-icon',
  } as IAmountRowItem;

  return (
    <View style={[styles.container, style]}>
      <AmountRow item={payItem} />
      <Svg iconStyle={styles.arrowIcon} icon="arrow-down-thin" color={theme.colors.iconBase3} size={pTd(22)} />
      <AmountRow item={receiveItem} />
    </View>
  );
};

export default memo(PreviewAmountCard);
