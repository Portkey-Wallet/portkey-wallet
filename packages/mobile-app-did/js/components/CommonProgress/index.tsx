import { makeStyles } from '@rneui/themed';
import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export type TCommonProgressProps = {
  percent: number;
  styles?: ViewStyle;
};
export const CommonProgress = ({ percent, styles: wrapStyles }: TCommonProgressProps) => {
  const styles = getStyles();
  const positionRight = useMemo(() => ({ right: percent >= 1 ? 0 : `${(1 - percent) * 100}%` }), [percent]);

  return (
    <View style={[styles.progressWrap, wrapStyles]}>
      <View style={[styles.progressFill, positionRight]} />
    </View>
  );
};

const getStyles = makeStyles(theme => ({
  progressWrap: {
    position: 'relative',
    width: '100%',
    height: pTd(8),
    borderRadius: pTd(4),
    backgroundColor: theme.colors.bgNeutral2,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    borderRadius: pTd(4),
    backgroundColor: theme.colors.bgBrand2,
  },
}));
