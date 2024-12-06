import React from 'react';
import { makeStyles } from '@rneui/themed';
import { Switch, Platform, SwitchProps } from 'react-native';
import { useTheme } from '@rneui/themed';

const CommonSwitch = (props: SwitchProps) => {
  const { theme } = useTheme();
  const style = getStyle();
  return (
    <Switch
      thumbColor="white"
      style={[props.disabled && Platform.OS === 'android' && style.switchDisabled]}
      trackColor={{ true: theme.colors.iconBrand6, false: '' }}
      {...props}
    />
  );
};
const getStyle = makeStyles(() => ({
  switchDisabled: {
    opacity: 0.3,
  },
}));

export default CommonSwitch;
