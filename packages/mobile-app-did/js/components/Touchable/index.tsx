import { useThrottleCallback } from '@portkey-wallet/hooks';
import React, { memo } from 'react';
import { TouchableOpacity, TouchableHighlight, TouchableOpacityProps } from 'react-native';
import { pTd } from 'utils/unit';

type TouchableProps = {
  onPressWithSecond?: number;
  highlight?: boolean;
};

const Touchable: React.FC<TouchableOpacityProps & TouchableProps> = props => {
  const { onPressIn, onPress, highlight, onPressWithSecond } = props;

  const handleOnPressIn = useThrottleCallback(onPressIn, [onPressIn], onPressWithSecond);
  const handleOnPress = useThrottleCallback(onPress, [onPress], onPressWithSecond);
  if (highlight)
    return (
      <TouchableHighlight
        hitSlop={{ left: pTd(10), right: pTd(10), top: pTd(10), bottom: pTd(10) }}
        {...props}
        onPressIn={onPressIn ? handleOnPressIn : undefined}
        onPress={onPress ? handleOnPress : undefined}
      />
    );

  return (
    <TouchableOpacity
      hitSlop={{ left: pTd(10), right: pTd(10), top: pTd(10), bottom: pTd(10) }}
      activeOpacity={0.7}
      {...props}
      onPressIn={onPressIn ? handleOnPressIn : undefined}
      onPress={onPress ? handleOnPress : undefined}
    />
  );
};
export default memo(Touchable);
