import React, { useMemo } from 'react';
import { StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { makeStyles } from '@rneui/themed';

type RedPacketAmountShowPropsType = {
  componentType: 'packetDetailPage' | 'sendPacketPage';
  amountShow: string;
  amountUsdShowStr?: string;
  symbol?: string;
  label?: string;
  textColor?: string;
  usdTextColor?: string;
  wrapStyle?: StyleProp<ViewStyle>;
  usdWrapStyle?: StyleProp<ViewStyle>;
};

export const RedPacketAmountShow = (props: RedPacketAmountShowPropsType) => {
  const {
    amountShow,
    symbol,
    label,
    textColor,
    amountUsdShowStr,
    usdTextColor,
    wrapStyle = {},
    usdWrapStyle = {},
  } = props;
  const styles = getStyles();

  const TextColorStyle = useMemo<StyleProp<TextStyle>>(() => ({ color: textColor }), [textColor]);
  const UsdTextColorStyle = useMemo<StyleProp<TextStyle>>(() => ({ color: usdTextColor }), [usdTextColor]);

  return (
    <>
      <Text style={[GStyles.textAlignCenter, wrapStyle]}>
        <Text style={[styles.amount, TextColorStyle]}>{amountShow || '0'}</Text>
        {symbol && <TextM style={[styles.symbol, TextColorStyle]}>{` ${label || symbol}`}</TextM>}
      </Text>
      <Text style={[GStyles.textAlignCenter, usdWrapStyle]}>
        <Text style={[styles.amountUsd, UsdTextColorStyle]}>{amountUsdShowStr}</Text>
      </Text>
    </>
  );
};

export default RedPacketAmountShow;

const getStyles = makeStyles(() => ({
  amount: {
    fontFamily: 'BricolageGrotesque-Bold',
    fontSize: pTd(32),
  },
  symbol: {
    fontFamily: 'BricolageGrotesque-Bold',
    fontSize: pTd(32),
  },
  amountUsd: {
    fontSize: pTd(16),
  },
}));
