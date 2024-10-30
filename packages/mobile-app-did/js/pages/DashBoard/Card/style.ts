import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from 'assets/theme/fonts';

const { white } = defaultColors;

export const styles = StyleSheet.create({
  cardWrap: {
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
  skeletonStyle: {
    backgroundColor: defaultColors.bg4,
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
    marginTop: pTd(16),
    display: 'flex',
    width: '100%',
    paddingHorizontal: pTd(16),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  usdtBalanceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usdtBalance: {
    ...fonts.mediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(38),
    height: pTd(38),
    color: white,
  },
  eyeIcon: {
    marginLeft: pTd(4),
  },
  buttonGroupWrap: {
    marginTop: pTd(32),
    marginBottom: pTd(24),
    width: '100%',
    paddingHorizontal: pTd(16),
  },
  spacerStyle: {
    width: pTd(32),
  },
  buttonWrapStyle1: {
    marginHorizontal: screenWidth * 0.03,
  },
});
