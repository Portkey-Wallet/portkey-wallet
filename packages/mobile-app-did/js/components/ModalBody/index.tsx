import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { darkColors, defaultColors } from 'assets/theme';
import { TextTitle } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { useGStyles } from 'assets/theme/useGStyles';
import ButtonRow from 'components/ButtonRow';
import { CommonButtonProps } from 'components/CommonButton';
import { ViewStyleType } from 'types/styles';
import { makeStyles } from '@rneui/themed';

export interface ModalBodyProps extends ViewProps {
  title?: string;
  leftTitleDom?: React.ReactNode;
  preventBack?: boolean;
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
    title = '',
    leftTitleDom,
    children,
    style = {},
    onClose,
    bottomButtonGroup,
    onTouchStart,
  } = props;

  const gStyles = useGStyles();
  const styles = getStyles();

  if (modalBodyType === 'bottom') {
    const showTopWrap = !!leftTitleDom || !!title || !!isShowRightCloseIcon;
    return (
      <View onTouchStart={onTouchStart} style={[styles.commonBox, gStyles.overlayStyle, styles.wrapStyle, style]}>
        <View style={styles.topWrap}>
          <View style={styles.slot} />
          {/* {isShowLeftBackIcon && (
              <View
                style={styles.leftIcon}
                pointerEvents="box-only"
                onTouchStart={() => {
                  onBack?.();
                  Keyboard.dismiss();
                  !preventBack && OverlayModal.hide();
                }}>
                <Svg icon="left-arrow" size={pTd(20)} />
              </View>
            )} */}
          {showTopWrap && (
            <>
              {leftTitleDom ? (
                leftTitleDom
              ) : (
                <TextTitle suppressHighlighting={true} style={styles.titleStyle} onPress={Keyboard.dismiss}>
                  {title}
                </TextTitle>
              )}

              {isShowRightCloseIcon && (
                <View
                  style={styles.closeIcon}
                  pointerEvents="box-only"
                  onTouchStart={() => {
                    onClose?.();
                    Keyboard.dismiss();
                    OverlayModal.hide();
                  }}>
                  <Svg icon="close3" size={pTd(20)} color={darkColors.iconBase1} />
                </View>
              )}
            </>
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

export const getStyles = makeStyles(theme => ({
  commonBox: {
    overflow: 'hidden',
    backgroundColor: darkColors.bgBase1,
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
  slot: {
    width: pTd(32),
    height: pTd(3),
    position: 'absolute',
    top: pTd(6),
    left: pTd(180.5),
    backgroundColor: darkColors.bgBase3,
    borderRadius: pTd(1),
  },
  leftIcon: {
    ...GStyles.paddingArg(17, 20),
    position: 'absolute',
    left: 0,
    zIndex: 10000,
  },
  titleStyle: {
    paddingLeft: pTd(16),
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    top: pTd(17),
    right: pTd(20),
    zIndex: 10000,
    width: pTd(20),
    height: pTd(20),
    padding: pTd(8),
    justifyContent: 'center',
    alignItems: 'center',
    color: darkColors.iconBase1,
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
  buttonGroup: {
    ...GStyles.paddingArg(0, 16, 14, 16),
    backgroundColor: theme.colors.bgBase1,
  },
  buttonStyle: {
    height: pTd(48),
    fontSize: pTd(16),
  },
  buttonTitleStyle: {
    fontSize: pTd(16),
  },
}));
