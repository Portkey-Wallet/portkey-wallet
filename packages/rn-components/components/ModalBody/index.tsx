import React from 'react';
import OverlayModal from '../OverlayModal';
import { Keyboard, View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from '../../utils/unit';
import { TextXL } from '../CommonText';
import Svg from '../Svg';
import ButtonRow from '../ButtonRow';
import { CommonButtonProps } from '../CommonButton';
import { ViewStyleType } from '../../theme/type';
import { makeStyles, useGStyles, useTheme } from '../../theme';

export interface ModalBodyProps extends ViewProps {
  title?: string;
  isShowLeftBackIcon?: boolean;
  isShowRightCloseIcon?: boolean;
  modalBodyType?: 'center' | 'bottom';
  style?: ViewStyleType;
  onClose?: () => void;
  onBack?: () => void;
  onTouchStart?: () => void;
  bottomButtonGroup?: {
    onPress?: () => void;
    type?: CommonButtonProps['type'];
    title: string;
    loading?: CommonButtonProps['loading'];
    disabled?: boolean;
  }[];
}

export const ModalBody: React.FC<ModalBodyProps> = props => {
  const {
    modalBodyType,
    isShowRightCloseIcon = true,
    isShowLeftBackIcon = false,
    title = '',
    children,
    style = {},
    onClose,
    bottomButtonGroup,
    onTouchStart,
  } = props;

  const gStyles = useGStyles();
  const styles = useStyles();
  const theme = useTheme();
  if (modalBodyType === 'bottom') {
    return (
      <View onTouchStart={onTouchStart} style={[styles.commonBox, gStyles.overlayStyle, styles.wrapStyle, style]}>
        <View style={styles.topWrap}>
          {isShowLeftBackIcon && (
            <View
              style={styles.leftIcon}
              pointerEvents="box-only"
              onTouchStart={() => {
                onClose?.();
                Keyboard.dismiss();
                OverlayModal.hide();
              }}>
              <Svg icon="left-arrow" size={pTd(20)} />
            </View>
          )}
          <TextXL suppressHighlighting={true} style={[styles.titleStyle, theme.mediumFont]} onPress={Keyboard.dismiss}>
            {title}
          </TextXL>
          {isShowRightCloseIcon && (
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
          )}
        </View>
        {children}
        {!!bottomButtonGroup && (
          <ButtonRow
            style={styles.buttonGroup}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
            buttons={bottomButtonGroup}
          />
        )}
      </View>
    );
  }

  return <View style={[styles.commonBox, styles.centerBox, style]}>{children}</View>;
};

export const useStyles = makeStyles(theme => {
  return {
    commonBox: {
      overflow: 'hidden',
      borderRadius: 10,
      backgroundColor: 'white',
    },
    wrapStyle: {
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
    leftIcon: {
      ...theme.paddingArg(17, 20),
      position: 'absolute',
      left: 0,
      zIndex: 10000,
    },
    titleStyle: {
      lineHeight: pTd(22),
      width: '100%',
      textAlign: 'center',
    },
    closeIcon: {
      position: 'absolute',
      top: pTd(17),
      right: pTd(20),
      zIndex: 10000,
      width: pTd(20),
      height: pTd(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerRow: {
      paddingTop: pTd(14),
      paddingBottom: pTd(7),
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border6,
    },
    headerIcon: {
      height: pTd(5),
      borderRadius: pTd(3),
      backgroundColor: theme.bg7,
      width: pTd(48),
    },
    buttonGroup: {
      backgroundColor: theme.bg1,
      position: 'absolute',
      bottom: 0,
      ...theme.paddingArg(10, 20, 16, 20),
    },
    buttonStyle: {
      height: pTd(48),
      fontSize: pTd(18),
    },
    buttonTitleStyle: {
      fontSize: pTd(16),
    },
  };
});
