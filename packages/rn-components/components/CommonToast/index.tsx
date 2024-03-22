import React, { ReactNode } from 'react';
import Toast from 'rn-teaset/components/Toast/Toast';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { StyleSheet, View } from 'react-native';
import Svg from '../Svg';
import { TextL } from '../CommonText';
import { pTd } from '../../utils/unit';
import { statusBarHeight } from '@portkey-wallet/utils/mobile/device';
import { handleErrorMessage } from '@portkey-wallet/utils';
import Lottie from 'lottie-react-native';
import { Theme } from '../../theme/type';
import { ThemeContext } from '../../theme/context';
import { getRealTheme } from '../../theme';

type TostProps = [
  text: string,
  duration?: number,
  position?: 'top' | 'bottom' | 'center',
  icon?: 'success' | ReactNode,
];
const tostProps = {
  overlayOpacity: 0,
  overlayPointerEvents: 'none',
  closeOnHardwareBackPress: false,
  position: 'center',
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: {
      paddingTop: statusBarHeight + 50,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    bottom: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 80,
    },
    toastRow: {
      maxWidth: '86%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 6,
      backgroundColor: theme.bg1,

      // shadow
      shadowOffset: { width: 0, height: 0 },
      shadowColor: theme.shadow1,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 2,
    },
    textStyle: {
      color: theme.font3,
      marginLeft: pTd(10),
      flexShrink: 1,
    },
  });

const icons: any = {
  success: <Svg icon="success" size={pTd(22)} />,
  fail: <Svg icon="fail" size={pTd(22)} />,
  warning: <Svg icon="warning" size={pTd(22)} />,
  loading: (
    <Lottie source={require('../../image/lottieFiles/loading.json')} style={{ height: pTd(22) }} autoPlay loop />
  ),
} as const;

const show = (...args: TostProps) => {
  const [text, duration = 2000, position = 'top', icon] = args;
  const key = Overlay.show(
    <ThemeContext.Consumer>
      {theme => {
        const realTheme = getRealTheme(theme);
        return (
          <Overlay.View
            {...tostProps}
            style={position ? getStyles(realTheme as Theme)[position] : undefined}
            position={position}>
            <View style={getStyles(realTheme as Theme).toastRow}>
              {typeof icon === 'string' ? icons[icon] : icon}
              <TextL style={getStyles(realTheme as Theme).textStyle}>{text}</TextL>
            </View>
          </Overlay.View>
        );
      }}
    </ThemeContext.Consumer>,
  );
  setTimeout(() => Overlay.hide(key), duration);
  return key;
};

let element: any;

export default {
  text(text: string) {
    Overlay.hide(element);
    element = show(text);
  },
  message(...args: TostProps) {
    Toast.hide(element);
    element = Toast.message(...args);
  },
  success(...args: TostProps) {
    if (!args[3]) args[3] = 'success';
    Overlay.hide(element);
    element = show(...args);
  },
  loading(...args: TostProps) {
    if (!args[3]) args[3] = 'loading';
    Overlay.hide(element);
    element = show(...args);
  },
  warn(...args: TostProps) {
    if (!args[3]) args[3] = 'warning';
    Overlay.hide(element);
    element = show(...args);
  },
  fail(...args: TostProps) {
    if (!args.length) return;
    if (!args[3]) args[3] = 'fail';
    Overlay.hide(element);
    args[0] = handleErrorMessage(args[0]);
    element = show(...args);
  },
  failError(error: any, errorText?: string) {
    Overlay.hide(element);
    const text = handleErrorMessage(error, errorText);
    if (text) element = show(text, undefined, 'top', 'fail');
  },
  smile(...args: TostProps) {
    Toast.hide(element);
    element = Toast.smile(...args);
  },
  sad(...args: TostProps) {
    Toast.hide(element);
    element = Toast.sad(...args);
  },
  info(...args: TostProps) {
    Toast.hide(element);
    element = Toast.info(...args);
  },
  stop(...args: TostProps) {
    Toast.hide(element);
    element = Toast.stop(...args);
  },
};
