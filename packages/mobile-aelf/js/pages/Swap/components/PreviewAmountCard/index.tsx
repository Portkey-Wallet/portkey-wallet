import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import Svg from 'components/Svg';
import { useTheme } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';
import { TCurrency } from '@portkey-wallet/types/awaken';
import CurrencyItem from '../CurrencyItem';
import { useAwakenTokenPrices } from '@portkey-wallet/hooks/hooks-eoa/awaken/state';
import { ZERO } from '@portkey-wallet/constants/misc';
import { formatPriceUsd } from '@portkey-wallet/utils/format';

interface IAmountRowProps {
  item: TCurrency;
  value?: string;
}

interface IPreviewAmountCardProps {
  style?: ViewStyleType;
  tokenIn?: TCurrency;
  tokenOut?: TCurrency;
  valueIn: string;
  valueOut: string;
}

const AmountRow = ({ item, value }: IAmountRowProps) => {
  const styles = getStyles();
  const { price } = useAwakenTokenPrices({
    symbol: item.symbol,
  });
  const balanceInUsd = useMemo(() => {
    if (!value) {
      return '';
    }
    return `$${formatPriceUsd(ZERO.plus(value).times(price))}`;
  }, [price, value]);

  return (
    <CurrencyItem
      wrapStyle={styles.tokenItem}
      balanceTextStyle={styles.balanceTextStyle}
      balanceInUseTextStyle={styles.balanceInUseTextStyle}
      item={item}
      balance={value}
      balanceInUsd={balanceInUsd}
    />
  );
};

const PreviewAmountCard = ({ style, tokenIn, tokenOut, valueIn, valueOut }: IPreviewAmountCardProps) => {
  const styles = getStyles();
  const { theme } = useTheme();

  if (!tokenIn || !tokenOut) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <AmountRow item={tokenIn} value={valueIn} />
      <Svg iconStyle={styles.arrowIcon} icon="arrow-down-thin" color={theme.colors.iconBase3} size={pTd(22)} />
      <AmountRow item={tokenOut} value={valueOut} />
    </View>
  );
};

export default memo(PreviewAmountCard);
