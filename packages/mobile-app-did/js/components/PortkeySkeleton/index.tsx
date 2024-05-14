import React from 'react';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { Skeleton, SkeletonProps } from '@rneui/base';
import { PortkeyLinearGradient } from 'components/PortkeyLinearGradient';

export type TPortkeySkeleton = SkeletonProps;

const PortkeySkeleton: React.FC<TPortkeySkeleton> = props => {
  const { animation = 'wave', width = pTd(140), height = pTd(40), style = {}, ...otherProps } = props;

  return (
    <Skeleton
      animation={animation}
      LinearGradientComponent={() => <PortkeyLinearGradient />}
      height={height}
      width={width}
      style={[styles.skeletonStyle, style]}
      {...otherProps}
    />
  );
};

export default PortkeySkeleton;

export const styles = StyleSheet.create({
  skeletonStyle: {
    backgroundColor: defaultColors.bg4,
  },
});
