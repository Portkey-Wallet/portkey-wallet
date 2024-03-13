import { createTheme } from '@rneui/themed';

export const defaultColors = {
  primary: '#f2f2f2',
  primaryLight: 'red',
  bgColor: '#ffffff',
  bgColor1: 'rgba(242, 244, 246, 1)',
  primaryColor: '#5B8EF4',

  bg1: '#ffffff',
  bg2: '#FEF6E7',
  bg3: '#F3E4E4',
  bg4: '#F7F8F9',
  bg5: '#5B8EF4',
  bg6: '#F7F7F9',
  bg7: '#DEE2E8',
  bg8: '#34C759',
  bg9: '#E7F0FC',
  bg10: '#F3E4E4',
  bg11: '#FEF6E7',
  bg12: '#BDD2FB',
  bg13: '#0075FF',
  bg14: '#CEDDFC',
  bg15: 'rgba(104, 170, 253, .2)',
  bg16: '#C5CBD5',
  bg17: '#EA4F45',
  bg18: '#F0F1F4',
  bg19: '#000000',
  bg20: '#515A62',
  bg21: '#FDEDEC',

  font1: '#464B53',
  font2: 'white',
  font3: '#515A62',
  font4: '#5B8EF4',
  font5: '#25272A',
  font6: '#FAAD14',
  font7: '#B6BABF',
  font8: '#252525',
  font9: '#000000',
  font10: '#34C759',
  font11: '#ffffff',
  font12: '#B34B4B',
  font13: '#EA4F45',

  icon1: '#515A62',
  icon2: '#ffffff',

  border1: '#C5CBD5',
  border2: '#F7F8F9',
  border3: '#5B8EF4',
  border4: '#F0F2F5',
  border5: '#F2F4F6',
  border6: '#DEE2E8',
  border7: '#C14247',

  error: '#B34B4B',
  error1: '#FF4D4F',

  shadow1: '#4D4E59',
};

export const AELFColors = {
  AELF: '#266CD3',
  tDVV: '#4B60DD',
};

export const myTheme = createTheme({
  lightColors: defaultColors,
  darkColors: defaultColors,
  mode: 'light',
});
