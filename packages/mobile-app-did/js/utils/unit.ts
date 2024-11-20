import { Dimensions } from 'react-native';

// Dimensions,width dp
const deviceWidthDp = Dimensions.get('window').width;
// Design draft width (750px here), unit px
const uiWidthPx = 393;

// px to dp (px in the design draft to dp in rn)
export const pTd = (uiElePx: number) => {
  return Math.round((uiElePx * deviceWidthDp) / uiWidthPx);
};
export const pTdSpec = (uiElePx: number) => {
  return (uiElePx * deviceWidthDp) / uiWidthPx;
};
export const pTdFloor = (uiElePx: number) => {
  return Math.floor((uiElePx * deviceWidthDp) / uiWidthPx);
};
