import { useContext, useMemo } from 'react';
import { ThemeContext } from './context';
import { Theme, ThemeType } from './type';
import { defaultCss } from './default';
import { StyleSheet } from 'react-native';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { isIOS } from '@rneui/base';
import { makeStyles as makeGStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import gSTyles from './GStyles';

export const defaultTheme = {
  light: { ...defaultCss },
  dark: { ...defaultCss },
  isDark: false,
};
let currentTheme: ThemeType = defaultTheme;

export const setTheme = (theme: ThemeType) => {
  currentTheme = theme;
};

export const getTheme = (): ThemeType => {
  return currentTheme;
};

export namespace ThemeStyleSheet {
  export function create(): Theme {
    const { isDark, light, dark } = getTheme();
    return !!isDark ? (dark as Theme) : (light as Theme);
  }
}
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  setTheme(theme);
  const { isDark, light, dark } = theme;
  return isDark ? dark : light;
};
export const getRealTheme = (theme: ThemeType) => {
  const { isDark, light, dark } = theme;
  return isDark ? dark : light;
};
export const makeStyles: <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>, V>(
  styles: T | ((theme: Theme, props: V) => T),
) => (props?: V) => T = styles => props => {
  const theme = useTheme();
  return useMemo(() => {
    const css = typeof styles === 'function' ? styles(theme, props as any) : styles;
    return StyleSheet.create(css);
  }, [props, theme]);
};

export const useGStyles = makeGStyles(theme => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg1,
      ...gSTyles.paddingArg(0, 16),
    },
    pwTip: {
      marginTop: 3,
      color: theme.colors.font2,
    },
    safeAreaContainer: {
      paddingBottom: !isIOS ? 20 : undefined,
    },
    overlayStyle: {
      height: windowHeight - pTd(isIOS ? 68 : 100),
    },
  };
});
