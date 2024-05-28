import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { defaultColors } from 'assets/theme';

const CommonSwitch = (props: SwitchProps) => {
  return <Switch thumbColor="white" trackColor={{ true: defaultColors.primaryColor, false: '' }} {...props} />;
};

export default CommonSwitch;
