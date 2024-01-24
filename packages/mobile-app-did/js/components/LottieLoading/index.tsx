import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Lottie, { AnimatedLottieViewProps, AnimationObject } from 'lottie-react-native';
import GStyles from 'assets/theme/GStyles';
import { ViewStyleType } from 'types/styles';
import { defaultColors } from 'assets/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const animation = require('assets/lottieFiles/loading.json') as AnimationObject;
const whiteColorFilters = animation.layers.map((layer: any) => {
  return {
    keypath: layer.nm,
    color: defaultColors.bg2,
  };
});

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
    source = require('assets/lottieFiles/loading.json'),
    lottieStyle = {},
    lottieWrapStyle = {},
    ...LottieProps
  } = props;

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
    <View style={[GStyles.flex1, GStyles.itemCenter, styles.wrapStyle, lottieWrapStyle]}>
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
