import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from 'assets/theme/fonts';
import { ScreenWidth } from '@rneui/base';

const { font11, font16, white } = defaultColors;

export const styles = StyleSheet.create({
  cardWrap: {
    backgroundColor: white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshWrap: {
    marginTop: pTd(8),
    width: screenWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  block: {
    flex: 1,
  },
  svgWrap: {
    marginTop: -pTd(33),
    padding: pTd(16),
    paddingTop: pTd(40),
  },
  textColumn: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: pTd(16),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  usdtBalance: {
    ...fonts.mediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(40),
    color: font16,
  },
  accountName: {
    color: font11,
    opacity: 0.8,
    fontSize: pTd(14),
    fontWeight: '400',
    lineHeight: pTd(20),
    paddingBottom: pTd(4),
  },
  buttonGroupWrap: {
    marginTop: pTd(24),
    width: ScreenWidth,
    paddingHorizontal: pTd(16),
  },
  spacerStyle: {
    width: pTd(32),
  },
  buttonWrapStyle1: {
    marginHorizontal: screenWidth * 0.03,
  },
});
