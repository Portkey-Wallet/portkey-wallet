import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { isNumberInInterval, INFINITY } from 'utils';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';

const RedPacketAmountShowInDetailPageStyleMap = {
  'amount-style1': {
    strLenIntervalLeft: INFINITY,
    strLenIntervalRight: 12,
    styles: {
      fontSize: pTd(40),
      lineHeight: pTd(48),
    },
  },
  'amount-style2': {
    strLenIntervalLeft: 12,
    strLenIntervalRight: 14,
    styles: { fontSize: pTd(36), lineHeight: pTd(44) },
  },
  'amount-style3': {
    strLenIntervalLeft: 14,
    strLenIntervalRight: 16,
    styles: {
      fontSize: pTd(32),
      lineHeight: pTd(40),
    },
  },
  'amount-style4': {
    strLenIntervalLeft: 16,
    strLenIntervalRight: 18,
    styles: {
      fontSize: pTd(26),
      lineHeight: pTd(34),
    },
  },
  'amount-style5': {
    strLenIntervalLeft: 18,
    strLenIntervalRight: 22,
    styles: {
      fontSize: pTd(24),
      lineHeight: pTd(32),
    },
  },
  'amount-style6': {
    strLenIntervalLeft: 22,
    strLenIntervalRight: 26,
    styles: {
      fontSize: pTd(20),
      lineHeight: pTd(28),
    },
  },
  'amount-style7': {
    strLenIntervalLeft: 26,
    strLenIntervalRight: 32,
    styles: {
      fontSize: pTd(16),
      lineHeight: pTd(24),
    },
  },
  'amount-style8': {
    strLenIntervalLeft: 32,
    strLenIntervalRight: 36,
    styles: {
      fontSize: pTd(14),
      lineHeight: pTd(22),
    },
  },
  'amount-style9': {
    strLenIntervalLeft: 36,
    strLenIntervalRight: INFINITY,
    styles: {
      fontSize: pTd(14),
      lineHeight: pTd(22),
    },
  },
} as const;

const RedPacketAmountShowInSendPageStyleMap = {
  'amount-style1': {
    strLenIntervalLeft: INFINITY,
    strLenIntervalRight: 16,
    styles: {
      fontSize: pTd(30),
      lineHeight: pTd(38),
    },
  },
  'amount-style2': {
    strLenIntervalLeft: 16,
    strLenIntervalRight: 22,
    styles: {
      fontSize: pTd(24),
      lineHeight: pTd(32),
    },
  },
  'amount-style3': {
    strLenIntervalLeft: 22,
    strLenIntervalRight: 26,
    styles: {
      fontSize: pTd(20),
      lineHeight: pTd(28),
    },
  },
  'amount-style4': {
    strLenIntervalLeft: 26,
    strLenIntervalRight: 34,
    styles: {
      fontSize: pTd(16),
      lineHeight: pTd(24),
    },
  },
  'amount-style5': {
    strLenIntervalLeft: 34,
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
  amountShow: string;
  symbol?: string;
  textColor?: string;
  wrapStyle?: StyleProp<ViewStyle>;
  assetType?: AssetType;
};

export const RedPacketAmountShow = (props: RedPacketAmountShowPropsType) => {
  const {
    componentType,
    amountShow,
    symbol,
    textColor = defaultColors.font15,
    wrapStyle = {},
    assetType = AssetType.ft,
  } = props;

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

  const amountShowValue = useMemo(() => {
    if (amountShow) return amountShow;
    return assetType === AssetType.ft ? '0.00' : '0';
  }, [amountShow, assetType]);

  return (
    <Text style={[GStyles.textAlignCenter, wrapStyle]}>
      <Text style={[amountShowStyle, styles.amount, TextColorStyle]}>{amountShowValue}</Text>
      {symbol && <TextM style={[GStyles.paddingLeft(pTd(8)), styles.symbol, TextColorStyle]}>{`  ${symbol}`}</TextM>}
    </Text>
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
