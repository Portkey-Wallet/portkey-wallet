import useDebounceCallback from '@portkey-wallet/hooks/useDebounceCallback';
import React, { memo } from 'react';
import { TouchableOpacity, TouchableHighlight, TouchableOpacityProps } from 'react-native';

type TouchableProps = {
  onPressWithSecond?: number;
  highlight?: boolean;
};

const Touchable: React.FC<TouchableOpacityProps & TouchableProps> = props => {
  const { onPressIn, onPress, highlight, onPressWithSecond } = props;

  const handleOnPressIn = useDebounceCallback(onPressIn, [onPressIn], onPressWithSecond);
  const handleOnPress = useDebounceCallback(onPress, [onPress], onPressWithSecond);
  if (highlight)
    return (
      <TouchableHighlight
        {...props}
        onPressIn={onPressIn ? handleOnPressIn : undefined}
        onPress={onPress ? handleOnPress : undefined}
      />
    );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
      onPressIn={onPressIn ? handleOnPressIn : undefined}
      onPress={onPress ? handleOnPress : undefined}
    />
  );
};
export default memo(Touchable);
