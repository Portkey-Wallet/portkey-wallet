import React from 'react';
import { pTd } from 'utils/unit';
import { Skeleton, SkeletonProps } from '@rneui/base';
import { PortkeyLinearGradientV2 } from 'components/PortkeyLinearGradient';
import { makeStyles } from '@rneui/themed';

export type TPortkeySkeleton = SkeletonProps;

const PortkeySkeleton: React.FC<TPortkeySkeleton> = props => {
  const { animation = 'wave', width = pTd(140), height = pTd(40), style = {}, ...otherProps } = props;
  const styles = getStyles();
  return (
    <Skeleton
      animation={animation}
      LinearGradientComponent={() => <PortkeyLinearGradientV2 />}
      height={height}
      width={width}
      style={[styles.skeletonStyle, style]}
      {...otherProps}
    />
  );
};

export default PortkeySkeleton;
export const getStyles = makeStyles(theme => ({
  skeletonStyle: {
    backgroundColor: theme.colors.bgBase3,
  },
}));
