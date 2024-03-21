import OverlayModal from 'components/OverlayModal';
import Touchable from 'components/Touchable';
import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { overlayStyles } from './styles';

export default function OverlayBody({
  type = 'bottom',
  style,
  children,
}: {
  type?: 'bottom' | 'center';
  children?: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[overlayStyles[`${type}Box`], style]}>
      <Touchable style={overlayStyles.headerRow} onPress={OverlayModal.hide}>
        <View style={overlayStyles.headerIcon} />
      </Touchable>
      {children}
    </View>
  );
}
