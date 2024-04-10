import { BGStyles, FontStyles } from '@portkey-wallet/rn-components/theme/styles';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import React from 'react';
import { StyleSheet, TouchableOpacityProps } from 'react-native';
import { pTd } from '@portkey-wallet/rn-components/utils/unit';
import { TextStyleType, ViewStyleType } from '@portkey-wallet/rn-components/theme/type';

export default function TabButton({
  onPress,
  title,
  isActive,
  titleText,
  style,
}: {
  style?: ViewStyleType;
  title: string;
  onPress: TouchableOpacityProps['onPress'];
  isActive?: boolean;
  titleText?: TextStyleType;
}) {
  return (
    <Touchable
      disabled={isActive}
      onPress={onPress}
      style={[styles.container, isActive ? BGStyles.bg6 : undefined, style]}>
      <TextM
        style={[
          FontStyles.font7,
          isActive ? [FontStyles.font5, FontStyles.weight500] : undefined,
          styles.titleStyle,
          titleText,
        ]}>
        {title}
      </TextM>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: pTd(12),
    borderRadius: 6,
    minHeight: 32,
  },
  titleStyle: {
    lineHeight: pTd(18),
  },
});
