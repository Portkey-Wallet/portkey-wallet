import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';
import React from 'react';
import { StyleSheet, TouchableOpacityProps } from 'react-native';
import { ViewStyleType } from 'types/styles';
import { pTd } from 'utils/unit';

export default function RoundButton({
  onPress,
  icon,
  style,
}: {
  icon: IconName;
  style?: ViewStyleType;
  onPress: TouchableOpacityProps['onPress'];
}) {
  const styles = getStyles();
  return (
    <Touchable onPress={onPress} style={[GStyles.center, styles.container, style]}>
      <Svg icon={icon} size={pTd(20)} />
    </Touchable>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: pTd(1.5),
    borderColor: theme.colors.borderNeutral2,
  },
}));
