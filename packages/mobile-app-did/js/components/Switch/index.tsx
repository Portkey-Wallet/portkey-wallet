import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Animated, SwitchProps } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 50,
    borderRadius: 15,
    backgroundColor: '#32CDFF',
  },
  scaleBg: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#E7E8EA',
  },
  toggleBtn: {
    height: 28,
    width: 28,
    backgroundColor: 'white',
    borderRadius: 14,
    position: 'absolute',
    top: 1,
  },
});
const sceneScale = 1;
const duration = 500;
function Switch({
  value,
  onValueChange,
  useOnce,
  onPress,
}: SwitchProps & {
  useOnce?: boolean;
  onPress?: () => void;
}) {
  const [toggleOn, setToggleOn] = useState<boolean>(false);
  const togglePosition = useRef(new Animated.Value(1)).current;
  const scaleBg = useRef(new Animated.Value(1)).current;
  useEffectOnce(() => {
    if (value) {
      setToggleOn(true);
      Animated.timing(scaleBg, {
        toValue: 0.1,
        duration,
        useNativeDriver: false,
      }).start();
      Animated.spring(togglePosition, {
        toValue: sceneScale * (50 - 29),
        useNativeDriver: false,
      }).start();
    }
  });
  const toggleSwitch = useCallback(() => {
    if (toggleOn && !useOnce) {
      setToggleOn(false);
      Animated.timing(togglePosition, { toValue: 1, duration, useNativeDriver: false }).start();
      Animated.timing(scaleBg, { toValue: 1, duration: duration / 2, useNativeDriver: false }).start();
      onValueChange?.(false);
    } else {
      setToggleOn(true);
      Animated.timing(togglePosition, {
        toValue: sceneScale * (50 - 29),
        duration,
        useNativeDriver: false,
      }).start();
      Animated.timing(scaleBg, { toValue: 0.0, duration: duration / 2, useNativeDriver: false }).start();
      if (onPress)
        setTimeout(() => {
          onPress();
        }, duration);

      onValueChange?.(true);
    }
  }, [onPress, onValueChange, scaleBg, toggleOn, togglePosition, useOnce]);
  return (
    <Touchable style={[styles.container]} onPressIn={toggleSwitch} activeOpacity={1}>
      <Animated.View style={[styles.scaleBg, { transform: [{ scale: scaleBg }] }]} />
      <Animated.View style={[styles.toggleBtn, { left: togglePosition }]} />
    </Touchable>
  );
}
export default Switch;
