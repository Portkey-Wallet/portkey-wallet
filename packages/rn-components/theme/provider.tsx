import React from 'react';
import { ThemeContext } from './context';
import { Theme, ThemeType } from './type';
import { defaultTheme, getTheme } from '.';
import ThemeInitializer from '../components/ThemeInitializer';

const CommonThemeProvider = ({ children, value }: { children: any; value?: ThemeType }) => {
  const defaultDark = defaultTheme.dark;
  const defaultLight = defaultTheme.light;
  const defaultIsDark = defaultTheme.isDark;
  const customDark = value?.dark ?? getTheme().dark;
  const customLight = value?.light ?? getTheme().light;
  const customIsDark = value?.isDark ?? getTheme().isDark;
  const dark = { ...defaultDark, ...customDark } as Theme;
  const light = { ...defaultLight, ...customLight } as Theme;
  const isDark = customIsDark ?? defaultIsDark;

  return (
    <ThemeContext.Provider value={{ dark, light, isDark }}>
      <ThemeInitializer />
      {children}
    </ThemeContext.Provider>
  );
};
export default CommonThemeProvider;
