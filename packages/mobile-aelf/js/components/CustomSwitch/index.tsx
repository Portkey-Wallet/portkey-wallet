import { makeStyles } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { pTd } from 'utils/unit';

export interface ICommonSwitchProps {
  value: boolean;
  onToggle?: (value: boolean) => void;
}

const CustomSwitch = ({ value, onToggle }: ICommonSwitchProps) => {
  const [position] = useState(new Animated.Value(value ? 3 : 19));
  const styles = getStyles();

  useEffect(() => {
    Animated.timing(position, {
      toValue: value ? 19 : 3,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, position]);

  return (
    <TouchableOpacity
      style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
      onPress={() => onToggle?.(!value)}
      activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX: position }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const getStyles = makeStyles(theme => ({
  switch: {
    width: pTd(40),
    height: pTd(24),
    borderRadius: pTd(12),
    justifyContent: 'center',
    padding: pTd(3),
  },
  switchOn: {
    backgroundColor: theme.colors.iconBrandTertiary,
  },
  switchOff: {
    backgroundColor: theme.colors.bgNeutral2,
  },
  circle: {
    width: pTd(18),
    height: pTd(18),
    borderRadius: pTd(9),
    backgroundColor: theme.colors.iconBase1,
    position: 'absolute',
  },
}));

export default CustomSwitch;
