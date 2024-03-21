import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';

const { bg1, bg4, font3, font5, font7 } = defaultColors;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: bg1,
    ...GStyles.paddingArg(0),
  },
  card: {
    backgroundColor: bg4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenImage: {
    marginTop: pTd(40),
  },
  tokenBalance: {
    ...fonts.mediumFont,
    paddingTop: pTd(60),
    color: font5,
    fontSize: pTd(28),
    lineHeight: pTd(28),
  },
  dollarBalance: {
    marginTop: pTd(4),
    color: font3,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  buttonGroupWrap: {
    marginTop: pTd(40),
    marginBottom: pTd(40),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    backgroundColor: bg1,
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
    fontSize: pTd(10),
  },
  buttonWrapStyle1: {
    marginHorizontal: pTd(16),
  },
  buttonRow: { width: '94%', justifyContent: 'space-around' },
});
