import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { isNumberInInterval, INFINITY } from 'utils';

const RedPacketAmountShowInDetailPageStyleMap = {
  'amount-style1': {
    strLenIntervalLeft: INFINITY,
    strLenIntervalRight: 14,
    styles: {
      fontSize: pTd(40),
      lineHeight: pTd(48),
    },
  },
  'amount-style2': {
    strLenIntervalLeft: 14,
    strLenIntervalRight: 16,
    styles: { fontSize: pTd(36), lineHeight: pTd(44) },
  },
  'amount-style3': {
    strLenIntervalLeft: 16,
    strLenIntervalRight: 18,
    styles: {
      fontSize: pTd(32),
      lineHeight: pTd(40),
    },
  },
  'amount-style4': {
    strLenIntervalLeft: 18,
    strLenIntervalRight: 20,
    styles: {
      fontSize: pTd(28),
      lineHeight: pTd(36),
    },
  },
  'amount-style5': {
    strLenIntervalLeft: 20,
    strLenIntervalRight: 24,
    styles: {
      fontSize: pTd(24),
      lineHeight: pTd(32),
    },
  },
  'amount-style6': {
    strLenIntervalLeft: 24,
    strLenIntervalRight: 28,
    styles: {
      fontSize: pTd(20),
      lineHeight: pTd(28),
    },
  },
  'amount-style7': {
    strLenIntervalLeft: 28,
    strLenIntervalRight: 37,
    styles: { fontSize: pTd(16), lineHeight: pTd(24) },
  },
  'amount-style8': {
    strLenIntervalLeft: 37,
    strLenIntervalRight: 42,
    styles: { fontSize: pTd(14), lineHeight: pTd(22) },
  },
  'amount-style9': {
    strLenIntervalLeft: 42,
    strLenIntervalRight: INFINITY,
    styles: { fontSize: pTd(14), lineHeight: pTd(22) },
  },
} as const;

const RedPacketAmountShowInSendPageStyleMap = {
  'amount-style1': {
    strLenIntervalLeft: INFINITY,
    strLenIntervalRight: 20,
    styles: {
      fontSize: pTd(30),
      lineHeight: pTd(38),
    },
  },
  'amount-style2': {
    strLenIntervalLeft: 20,
    strLenIntervalRight: 25,
    styles: {
      fontSize: pTd(24),
      lineHeight: pTd(32),
    },
  },
  'amount-style3': {
    strLenIntervalLeft: 25,
    strLenIntervalRight: 30,
    styles: {
      fontSize: pTd(20),
      lineHeight: pTd(28),
    },
  },
  'amount-style4': {
    strLenIntervalLeft: 30,
    strLenIntervalRight: 36,
    styles: {
      fontSize: pTd(16),
      lineHeight: pTd(24),
    },
  },
  'amount-style5': {
    strLenIntervalLeft: 36,
    strLenIntervalRight: 42,
    styles: {
      fontSize: pTd(14),
      lineHeight: pTd(22),
    },
  },
  'amount-style6': {
    strLenIntervalLeft: 42,
    strLenIntervalRight: INFINITY,
    styles: {
      fontSize: pTd(14),
      lineHeight: pTd(22),
    },
  },
} as const;

export type RedPacketAmountShowInRedPacketStyleKeyItemType = keyof typeof RedPacketAmountShowInDetailPageStyleMap;
export type RedPacketAmountShowInSendPageStyleKeyItemType = keyof typeof RedPacketAmountShowInSendPageStyleMap;

type RedPacketAmountShowPropsType = {
  componentType: 'packetDetailPage' | 'sendPacketPage';
  amount: string;
  decimals: string | number;
  symbol: string;
  textColor?: string;
  wrapStyle?: StyleProp<ViewStyle>;
};

export const RedPacketAmountShow = (props: RedPacketAmountShowPropsType) => {
  const { componentType, amount, decimals, symbol = 'ELF', textColor = defaultColors.font15, wrapStyle = {} } = props;
  const amountShow = useMemo(() => formatAmountShow(divDecimals(amount, decimals), decimals), [amount, decimals]);

  const amountShowStyle = useMemo(() => {
    let type = 'amount-style1';
    let styleNum = 1;

    const len = amountShow.length;
    const map =
      componentType === 'packetDetailPage'
        ? RedPacketAmountShowInDetailPageStyleMap
        : RedPacketAmountShowInSendPageStyleMap;

    while (
      !isNumberInInterval(
        len,
        map[type as RedPacketAmountShowInSendPageStyleKeyItemType].strLenIntervalLeft || 'Infinity',
        map[type as RedPacketAmountShowInSendPageStyleKeyItemType]?.strLenIntervalRight,
      )
    ) {
      type = `amount-style${styleNum}`;
      styleNum++;
    }

    return map[type as RedPacketAmountShowInSendPageStyleKeyItemType]?.styles;
  }, [amountShow.length, componentType]);

  const TextColorStyle = useMemo<StyleProp<TextStyle>>(() => ({ color: textColor }), [textColor]);

  return (
    <View style={[GStyles.flexRowWrap, GStyles.itemEnd, GStyles.flexCenter, wrapStyle]}>
      <Text style={[amountShowStyle, styles.amount, TextColorStyle]}>{amountShow}</Text>
      <TextM style={[GStyles.marginLeft(pTd(8)), styles.symbol, TextColorStyle]}>{symbol}</TextM>
    </View>
  );
};

export default RedPacketAmountShow;

const styles = StyleSheet.create({
  amount: {
    color: defaultColors.font15,
    ...fonts.mediumFont,
  },
  symbol: {
    color: defaultColors.font15,
  },
});
