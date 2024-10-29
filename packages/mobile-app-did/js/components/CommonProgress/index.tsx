import { makeStyles } from '@rneui/themed';
import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export type TCommonProgressProps = {
  percent: number;
  styles?: ViewStyle;
};
export const CommonProgress = ({ percent, styles: wrapStyles }: TCommonProgressProps) => {
  const styles = getStyles();
  const progressValue = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: percent,
      duration: 600,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [percent, progressValue]);

  const positionRight = useMemo(
    () => ({
      right: progressValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '0%'],
      }),
    }),
    [progressValue],
  );

  // const positionRight = useMemo(() => ({ right: percent >= 1 ? 0 : `${(1 - percent) * 100}%` }), [percent]);

  return (
    <View style={[styles.progressWrap, wrapStyles]}>
      <Animated.View style={[styles.progressFill, positionRight]} />
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
