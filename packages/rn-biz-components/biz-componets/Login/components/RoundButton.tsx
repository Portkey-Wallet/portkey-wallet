import GStyles from '@portkey-wallet/rn-components/theme/GStyles';
import { defaultCss } from '@portkey-wallet/rn-components/theme/default';
import Svg, { IconName } from '@portkey-wallet/rn-components/components/Svg';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import React from 'react';
import { StyleSheet, TouchableOpacityProps } from 'react-native';
import { pTd } from '@portkey-wallet/rn-components/utils/unit';
import { ViewStyleType } from '@portkey-wallet/rn-components/theme/type';

export default function RoundButton({
  onPress,
  icon,
  style,
}: {
  icon: IconName;
  style?: ViewStyleType;
  onPress: TouchableOpacityProps['onPress'];
}) {
  return (
    <Touchable onPress={onPress} style={[GStyles.center, styles.container, style]}>
      <Svg icon={icon} size={pTd(20)} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultCss.border1,
  },
});
