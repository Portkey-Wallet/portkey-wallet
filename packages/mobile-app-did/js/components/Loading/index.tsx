import React from 'react';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextL } from '../CommonText';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import Spinner from 'react-native-spinkit';
import { FontStyles } from 'assets/theme/styles';

let elements: number[] = [];
let timer: NodeJS.Timeout | null = null;
type IconType = 'loading';

type ShowOptionsType = {
  text?: string;
  iconType?: IconType;
  isMaskTransparent?: boolean;
  overlayProps?: any;
  duration?: number;
};

function LoadingBody({ text }: { text?: string; iconType: IconType }) {
  return (
    <View style={GStyles.center}>
      <Spinner type="Circle" color={FontStyles.font11.color} size={40} />
      <TextL style={styles.textStyles}>{text}</TextL>
    </View>
  );
}

export default class Loading extends React.Component {
  static show(options?: ShowOptionsType) {
    const { text = 'Loading...', iconType = 'loading', isMaskTransparent = true, overlayProps = {} } = options || {};
    Keyboard.dismiss();
    Loading.hide();
    const overlayView = (
      <Overlay.PopView
        modal={true}
        type="zoomIn"
        style={[styles.container, isMaskTransparent && styles.maskTransparent]}
        overlayOpacity={0}
        {...overlayProps}>
        <LoadingBody text={text} iconType={iconType} />
      </Overlay.PopView>
    );
    elements.push(Overlay.show(overlayView));
    // timer && clearBackgroundTimeout(timer);
    // timer = setBackgroundTimeout(() => {
    //   Loading.hide();
    // }, duration);
  }

  static hide() {
    timer && clearTimeout(timer);
    timer = null;
    elements = elements.filter(item => item); // Discard invalid data
    const topItem = elements.pop();
    Overlay.hide(topItem);
  }

  static destroy() {
    timer && clearTimeout(timer);
    timer = null;
    elements.forEach(item => Overlay.hide(item));
    elements = [];
  }

  componentWillUnmount() {
    Loading.destroy();
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultColors.bg1,
  },
  maskTransparent: {
    backgroundColor: '#00000030',
  },
  textStyles: {
    color: defaultColors.font11,
    marginTop: 20,
  },
});
