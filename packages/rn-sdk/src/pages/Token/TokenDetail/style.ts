import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { getStatusBarHeight } from 'utils/screen';

const { bg1, bg4, bg5, font3, font5, font7 } = defaultColors;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: bg5,
    ...GStyles.paddingArg(0),
    paddingTop: getStatusBarHeight(true),
  },
  iconWrap: {
    width: pTd(20),
    marginLeft: pTd(20),
    marginBottom: pTd(16),
    marginTop: pTd(16),
  },
  pageContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: bg1,
  },
  navigationBar: {
    width: '100%',
    height: 44,
    backgroundColor: 'red',
    flexDirection: 'row',
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
});
