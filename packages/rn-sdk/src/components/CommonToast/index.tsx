import React, { ReactNode } from 'react';
import Toast from 'rn-teaset/components/Toast/Toast';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import CommonSvg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { statusBarHeight } from 'packages/utils/mobile/device';
import { handleErrorMessage } from 'packages/utils';
import Lottie from 'lottie-react-native';

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

const styles = StyleSheet.create({
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
    backgroundColor: defaultColors.bg1,

    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowColor: defaultColors.shadow1,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  textStyle: {
    color: defaultColors.font3,
    marginLeft: pTd(10),
    flexShrink: 1,
  },
});

const icons: any = {
  success: <CommonSvg icon="success" size={pTd(22)} />,
  fail: <CommonSvg icon="fail" size={pTd(22)} />,
  warning: <CommonSvg icon="warning" size={pTd(22)} />,
  loading: <Lottie source={require('assets/lottieFiles/loading.json')} style={{ height: pTd(22) }} autoPlay loop />,
} as const;

const show = (...args: TostProps) => {
  const [text, duration = 2000, position = 'top', icon] = args;
  const key = Overlay.show(
    <Overlay.View {...tostProps} style={position ? styles[position] : undefined} position={position}>
      <View style={styles.toastRow}>
        {typeof icon === 'string' ? icons[icon] : icon}
        <TextL style={styles.textStyle}>{text}</TextL>
      </View>
    </Overlay.View>,
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
    args[0] && console.warn('CommonToast.warn:', args[0]);
  },
  fail(...args: TostProps) {
    if (!args[3]) args[3] = 'fail';
    Overlay.hide(element);
    element = show(...args);
    args[0] && console.error('CommonToast.fail:', args[0]);
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
