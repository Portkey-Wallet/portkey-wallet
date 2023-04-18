import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme/index';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

const { font5, error, bg1, border4 } = defaultColors;

export const generalStyles = StyleSheet.create({
  outerWrap: {
    height: pTd(56),
    borderRadius: pTd(6),
    overflow: 'hidden',
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: bg1,
  },
  commonFix: {
    height: pTd(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: border4,
  },
  prefix: {
    width: pTd(56),
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  suffix: {
    width: pTd(64),
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  containerStyle: {
    ...GStyles.paddingArg(0),
    ...GStyles.marginArg(0),
    alignItems: 'center',
    height: pTd(56),
    flex: 1,
  },
  inputContainerStyle: {
    overflow: 'hidden',
    height: pTd(56),
    borderRadius: pTd(4),
    borderColor: 'white', // how to delete bottom border?
  },
  inputStyle: {
    color: defaultColors.font5,
    fontSize: pTd(14),
    ...GStyles.marginArg(0, 16),
  },
  rightIconContainerStyle: {
    paddingRight: pTd(60),
  },
  errorStyle: {
    marginTop: pTd(4),
    paddingLeft: pTd(8),
    color: error,
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
  disabledInputStyle: {
    color: font5,
    opacity: 1,
  },
});
