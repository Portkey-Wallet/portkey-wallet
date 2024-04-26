import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';

const { white, font11, font5, font7 } = defaultColors;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: white,
    ...GStyles.paddingArg(0),
  },
  card: {
    backgroundColor: white,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenImage: {
    marginTop: pTd(40),
  },
  mainTitleIcon: {
    height: 24,
    width: 24,
    marginRight: 4,
  },
  tokenBalance: {
    ...fonts.mediumFont,
    paddingTop: pTd(32),
    color: font5,
    fontSize: pTd(28),
    lineHeight: pTd(28),
  },
  dollarBalance: {
    marginTop: pTd(4),
    color: font11,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  listFront: {
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: pTd(16),
    fontWeight: '900',
    lineHeight: pTd(24),
    paddingVertical: pTd(8),
  },
  divide: {
    borderBottomColor: '#DEE2E8',
    borderBottomWidth: StyleSheet.hairlineWidth * 1.5,
  },
  buttonGroupWrap: {
    backgroundColor: white,
    marginTop: pTd(32),
    marginBottom: pTd(32),
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
    fontSize: pTd(10),
  },
  buttonWrapStyle1: {
    marginHorizontal: pTd(16),
  },
  buttonRow: { width: '94%', justifyContent: 'space-around' },
});
