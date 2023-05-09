import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from 'assets/theme/fonts';

const { bg5, font2 } = defaultColors;

export const styles = StyleSheet.create({
  cardWrap: {
    backgroundColor: bg5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    marginTop: -pTd(16),
    padding: pTd(16),
  },
  usdtBalance: {
    ...fonts.mediumFont,
    fontSize: pTd(30),
    lineHeight: pTd(34),
    color: font2,
  },
  accountName: {
    color: font2,
    opacity: 0.8,
    lineHeight: pTd(20),
  },
  buttonGroupWrap: {
    marginTop: pTd(24),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacerStyle: {
    width: pTd(32),
  },
});
