import { useContext } from 'react';
import { ThemeContext } from './context';
import { Theme, ThemeType } from './type';
import { defaultCss } from './default';

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
    return isDark ? dark : light;
  }
  // export function getStyles(theme)
}
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  setTheme(theme);
  const { isDark, light, dark } = theme;
  return isDark ? dark : light;
};
