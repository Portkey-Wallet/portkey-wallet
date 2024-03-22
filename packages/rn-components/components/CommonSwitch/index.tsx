import React, { useMemo } from 'react';
import { Switch, SwitchProps } from 'react-native';
import { isIOS } from '@rneui/base';
import { useTheme } from '../../theme';

const CommonSwitch = (props: SwitchProps) => {
  const { value } = props;
  const theme = useTheme();
  const androidColor = useMemo(() => (value ? theme.bg12 : theme.bg7), [value]);

  return (
    <Switch
      thumbColor={isIOS ? theme.bg1 : androidColor}
      trackColor={{ true: isIOS ? '' : theme.bg5, false: isIOS ? '' : theme.bg16 }}
      {...props}
    />
  );
};

export default CommonSwitch;
