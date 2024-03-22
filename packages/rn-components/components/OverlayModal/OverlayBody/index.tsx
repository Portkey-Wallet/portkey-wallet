import OverlayModal from '../../OverlayModal';
import Touchable from '../../Touchable';
import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { useTheme } from '../../../theme';

export default function OverlayBody({
  type = 'bottom',
  style,
  children,
}: {
  type?: 'bottom' | 'center';
  children?: ReactNode;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const overlayStyles = getStyles(theme);
  return (
    <View style={[overlayStyles[`${type}Box`], style]}>
      <Touchable style={overlayStyles.headerRow} onPress={OverlayModal.hide}>
        <View style={overlayStyles.headerIcon} />
      </Touchable>
      {children}
    </View>
  );
}
