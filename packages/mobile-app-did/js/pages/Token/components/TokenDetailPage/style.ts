import { StyleSheet } from 'react-native';
import { defaultColors, darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

const { white, font7 } = defaultColors;

export const styles = StyleSheet.create({
  pageWrap: {
    width: '100%',
    flex: 1,
    backgroundColor: darkColors.bgBase1,
  },
  card: {
    flexDirection: 'column',
    marginTop: pTd(16),
    marginLeft: pTd(16),
    marginRight: pTd(16),
  },
  tokenImage: {
    marginTop: pTd(40),
  },
  mainTitleLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitleIcon: {
    height: pTd(18),
    width: pTd(18),
    marginRight: 4,
  },
  tokenBalance: {
    ...fonts.mediumFont,
    color: darkColors.textBase1,
    fontSize: pTd(32),
    lineHeight: pTd(40),
  },
  dollarBalance: {
    marginTop: pTd(4),
    color: darkColors.textBase1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    height: pTd(20),
  },
  textOverflow: {
    fontSize: pTd(28),
    lineHeight: pTd(40),
  },
  listFront: {
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: pTd(16),
    fontWeight: '900',
    lineHeight: pTd(24),
    paddingVertical: pTd(8),
  },
  buttonGroupWrap: {
    marginTop: pTd(32),
    marginBottom: pTd(32),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  spacerStyle: {
    width: pTd(36),
  },
  transferWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultWrap: {
    backgroundColor: white,
  },
  noResultText: {
    textAlign: 'center',
    marginTop: pTd(8),
    color: font7,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  listWrap: {
    backgroundColor: defaultColors.bg1,
  },
  subTitle: {
    fontSize: pTd(12),
  },
  buttonWrapStyle1: {
    marginHorizontal: pTd(16),
  },
  buttonRow: { width: '94%', justifyContent: 'space-around' },
  banner: {
    marginBottom: pTd(8),
  },
});
