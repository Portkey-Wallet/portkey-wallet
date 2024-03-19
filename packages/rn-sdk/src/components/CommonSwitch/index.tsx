import React, { useMemo } from 'react';
import { Switch, SwitchProps } from 'react-native';
import { defaultColors } from 'assets/theme';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

const CommonSwitch = (props: SwitchProps) => {
  const { value } = props;

  const androidColor = useMemo(() => (value ? defaultColors.bg12 : defaultColors.bg7), [value]);

  return (
    <Switch
      thumbColor={isIOS ? defaultColors.bg1 : androidColor}
      trackColor={{ true: isIOS ? '' : defaultColors.bg5, false: isIOS ? '' : defaultColors.bg16 }}
      {...props}
    />
  );
};

export default CommonSwitch;
