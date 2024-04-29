import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

const { font16 } = defaultColors;

export const commonButtonStyle = StyleSheet.create({
  buttonWrap: {
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
    color: font16,
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
  dashBoardTitleColorStyle: {
    color: font16,
    lineHeight: pTd(16),
    fontWeight: '400',
  },
  innerPageTitleColorStyle: {
    color: font16,
  },
});
