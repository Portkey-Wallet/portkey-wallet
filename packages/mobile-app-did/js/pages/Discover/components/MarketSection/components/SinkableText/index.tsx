import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';

export interface ISinkableTextProps {
  sinkable: boolean;
  value: number;
}
export function getDecimalPlaces(num: number): number {
  if (!num) {
    return 0;
  }
  const match = num.toString().match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0),
  );
}
function calculateSinkValue(num: number): { sink: number; validNum: string } {
  const match = num.toFixed(getDecimalPlaces(num)).match(/0\.0*(\d+)/);
  return match
    ? { sink: match[0].length - 2 - match[1].length, validNum: match[1] }
    : { sink: 0, validNum: num.toFixed(getDecimalPlaces(num)).toString() };
}
export default function SinkableText(props: ISinkableTextProps) {
  const { value, sinkable } = props;
  const { sink: sinkValue, validNum } = useRef(calculateSinkValue(value)).current;
  const showSink = useMemo(() => {
    return sinkable && sinkValue > 4;
  }, [sinkable, sinkValue]);
  return (
    <View style={[styles.priceWrapper, styles.section2Width]}>
      <Text style={[styles.text3, FontStyles.neutralPrimaryTextColor, GStyles.alignCenter]}>
        ${showSink ? '0.0' : value.toFixed(getDecimalPlaces(value) < 2 ? 2 : getDecimalPlaces(value)).toString()}
      </Text>
      {showSink && <Text style={[styles.priceSinkText, GStyles.alignEnd]}>{sinkValue}</Text>}
      {showSink && (
        <Text style={[styles.text3, FontStyles.neutralPrimaryTextColor, GStyles.alignCenter]}>{validNum}</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  priceWrapper: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    height: pTd(22),
  },
  text3: {
    fontSize: pTd(14),
    fontWeight: '500',
    textAlign: 'right',
  },
  priceSinkText: {
    fontSize: pTd(12),
  },
  section2Width: {
    width: pTd(92),
  },
});
