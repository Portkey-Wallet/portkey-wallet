import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { darkColors } from 'assets/theme';

const CommonSwitch = (props: SwitchProps) => {
  return <Switch thumbColor="white" trackColor={{ true: darkColors.iconBrand6, false: '' }} {...props} />;
};

export default CommonSwitch;
