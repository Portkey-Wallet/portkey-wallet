import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

const { font2, font4 } = defaultColors;

export const commonButtonStyle = StyleSheet.create({
  buttonWrap: {
    marginBottom: pTd(24),
    width: pTd(54),
  },
  iconWrapStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  commonTitleStyle: {
    width: '100%',
    marginTop: pTd(4),
    textAlign: 'center',
    color: font2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  dashBoardTitleColorStyle: {
    color: font2,
  },
  innerPageTitleColorStyle: {
    color: font4,
  },
});

export const dashBoardBtnStyle = StyleSheet.create({
  buttonWrap: {
    marginBottom: pTd(24),
    width: pTd(65),
  },
  iconWrapStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  commonTitleStyle: {
    width: '100%',
    marginTop: pTd(4),
    textAlign: 'center',
    color: font2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  dashBoardTitleColorStyle: {
    color: font2,
  },
  innerPageTitleColorStyle: {
    color: font4,
  },
});
