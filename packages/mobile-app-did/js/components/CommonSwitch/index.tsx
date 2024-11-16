import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { useTheme } from '@rneui/themed';

const CommonSwitch = (props: SwitchProps) => {
  const { theme } = useTheme();
  return <Switch thumbColor="white" trackColor={{ true: theme.colors.iconBrand6, false: '' }} {...props} />;
};

export default CommonSwitch;
