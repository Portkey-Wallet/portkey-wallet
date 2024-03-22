import React from 'react';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextM } from '../CommonText';
import { pTd } from '../../utils/unit';
import { LottieView } from '../LottieView';
import { Theme } from '../../theme/type';
import { getRealTheme, makeStyles, useTheme } from '../../theme';
import { ThemeContext } from '../../theme/context';

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

type LoadingPositionType = 'center' | 'bottom';

export function LoadingBody({ text }: { text?: string; position?: LoadingPositionType; iconType: IconType }) {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <View style={[theme.center, styles.loadingWrap]}>
      <LottieView source={require('assets/lottieFiles/globalLoading.json')} style={styles.loadingStyle} autoPlay loop />
      <TextM style={styles.textStyles}>{text}</TextM>
    </View>
  );
}

export default class Loading extends React.Component {
  static show(options?: ShowOptionsType, isKeyboardShow?: boolean): number {
    const { text = 'Loading...', iconType = 'loading', isMaskTransparent = true, overlayProps = {} } = options || {};
    !isKeyboardShow && Keyboard.dismiss();
    Loading.hide();
    const overlayView = (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Overlay.PopView
              modal={true}
              type="zoomIn"
              style={[
                getStyles(getRealTheme(theme) as Theme).container,
                isMaskTransparent && getStyles(getRealTheme(theme) as Theme).maskTransparent,
              ]}
              overlayOpacity={0}
              {...overlayProps}>
              <LoadingBody text={text} iconType={iconType} />
            </Overlay.PopView>
          );
        }}
      </ThemeContext.Consumer>
    );
    const key = Overlay.show(overlayView);
    elements.push(key);
    return key;
    // timer && clearBackgroundTimeout(timer);
    // timer = setBackgroundTimeout(() => {
    //   Loading.hide();
    // }, duration);
  }

  static showOnce(options?: ShowOptionsType) {
    if (elements.length) return;
    Loading.show(options);
  }

  static hide(key?: number) {
    timer && clearTimeout(timer);
    timer = null;
    elements = elements.filter(item => item); // Discard invalid data
    let keyItem: number | undefined;
    if (key !== undefined) {
      keyItem = elements.find(item => item === key);
      elements = elements.filter(item => item !== key);
    } else {
      keyItem = elements.pop();
    }
    keyItem !== undefined && Overlay.hide(keyItem);
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
const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.bg1,
    },
    maskTransparent: {
      backgroundColor: '#00000030',
    },
    loadingWrap: {
      width: pTd(224),
      minHeight: pTd(120),
      padding: pTd(16),
      backgroundColor: theme.bg1,
      borderRadius: pTd(6),
    },
    loadingStyle: {
      width: pTd(50),
    },
    textStyles: {
      color: theme.font5,
      marginTop: pTd(10),
    },
  };
});
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.bg1,
    },
    maskTransparent: {
      backgroundColor: '#00000030',
    },
    loadingWrap: {
      width: pTd(224),
      minHeight: pTd(120),
      padding: pTd(16),
      backgroundColor: theme.bg1,
      borderRadius: pTd(6),
    },
    loadingStyle: {
      width: pTd(50),
    },
    textStyles: {
      color: theme.font5,
      marginTop: pTd(10),
    },
  });
