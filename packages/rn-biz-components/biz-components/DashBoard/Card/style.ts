import { StyleSheet } from 'react-native';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from '@portkey-wallet/rn-base/assets/theme/fonts';
import { ScreenWidth } from '@rneui/base';

const { bg5, font2 } = defaultColors;

export const styles = StyleSheet.create({
  cardWrap: {
    backgroundColor: bg5,
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
