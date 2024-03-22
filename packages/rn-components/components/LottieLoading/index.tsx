import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from '../../utils/unit';
import Lottie, { AnimatedLottieViewProps, AnimationObject } from 'lottie-react-native';
import { ViewStyleType } from '../../theme/type';
import { useTheme } from '../../theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const animation = require('../../image/lottieFiles/loading.json') as AnimationObject;

type LottieLoadingPropsType = {
  color?: 'white' | 'blue';
  type?: 'custom' | 'innerPage';
  lottieStyle?: any;
  lottieWrapStyle?: ViewStyleType;
} & Omit<AnimatedLottieViewProps, 'source'> & { source?: string | AnimationObject | { uri: string } };
const LottieLoading = (props: LottieLoadingPropsType) => {
  const {
    color = 'blue',
    type = 'innerPage',
    source = require('../../image/lottieFiles/loading.json'),
    lottieStyle = {},
    lottieWrapStyle = {},
    ...LottieProps
  } = props;
  const theme = useTheme();
  const whiteColorFilters = animation.layers.map((layer: any) => {
    return {
      keypath: layer.nm,
      color: theme.bg2,
    };
  });
  if (type === 'custom')
    return (
      <Lottie
        style={[styles.loadingStyle, lottieStyle]}
        autoPlay
        loop
        source={source}
        colorFilters={color === 'white' ? whiteColorFilters : undefined}
        {...LottieProps}
      />
    );

  return (
    <View style={[theme.flex1, theme.itemCenter, styles.wrapStyle, lottieWrapStyle]}>
      <Lottie
        autoPlay
        loop
        source={source}
        colorFilters={color === 'white' ? whiteColorFilters : undefined}
        style={[styles.loadingStyle, lottieStyle]}
        {...LottieProps}
      />
    </View>
  );
};
export default memo(LottieLoading);
const styles = StyleSheet.create({
  loadingStyle: {
    width: pTd(20),
  },
  wrapStyle: {
    paddingTop: pTd(24),
  },
});
