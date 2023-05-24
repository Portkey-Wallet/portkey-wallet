import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, View, ViewProps } from 'react-native';
import { StyleSheet, ViewStyle } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TextXL } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';

export interface ModalBodyProps extends ViewProps {
  title?: string;
  modalBodyType?: 'center' | 'bottom';
  style?: ViewStyle;
  onClose?: () => void;
}

export const ModalBody: React.FC<ModalBodyProps> = props => {
  const { modalBodyType, title, children, style = {}, onClose } = props;

  if (modalBodyType === 'bottom') {
    return (
      <View style={[styles.commonBox, styles.bottomBox, style]}>
        <View style={[styles.topWrap]}>
          <TextXL suppressHighlighting={true} style={[styles.titleStyle]} onPress={Keyboard.dismiss}>
            {title}
          </TextXL>
          <View
            style={styles.closeIcon}
            pointerEvents="box-only"
            onTouchStart={() => {
              onClose?.();
              Keyboard.dismiss();
              OverlayModal.hide();
            }}>
            <Svg icon="close" size={pTd(12)} />
          </View>
        </View>
        {children}
      </View>
    );
  }

  return <View style={[styles.commonBox, styles.centerBox, style]}>{children}</View>;
};

export const styles = StyleSheet.create({
  commonBox: {
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  bottomBox: {
    width: screenWidth,
  },
  centerBox: {
    width: screenWidth * 0.85,
  },
  topWrap: {
    position: 'relative',
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
  },
  titleStyle: {
    lineHeight: pTd(22),
    width: '100%',
    textAlign: 'center',
  },
  closeIcon: {
    ...GStyles.paddingArg(21, 28),
    position: 'absolute',
    right: 0,
  },
  headerRow: {
    paddingTop: pTd(14),
    paddingBottom: pTd(7),
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
  },
  headerIcon: {
    height: pTd(5),
    borderRadius: pTd(3),
    backgroundColor: defaultColors.bg7,
    width: pTd(48),
  },
});
