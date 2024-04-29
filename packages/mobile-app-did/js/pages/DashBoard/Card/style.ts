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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    height: pTd(44),
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
    height: pTd(40),
    color: font16,
  },
  accountName: {
    color: font11,
    opacity: 0.8,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    height: pTd(20),
    marginBottom: pTd(4),
  },
  buttonGroupWrap: {
    marginTop: 32,
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
