import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import GStyles from '../../../../assets/theme/GStyles';
import fonts from '../../../../assets/theme/fonts';
import { StyleSheet } from 'react-native';
import { pTd } from '../../../../utils/unit';

export const styles = StyleSheet.create({
  contentWrap: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },

  method: {
    overflow: 'hidden',
    borderRadius: pTd(6),
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.primaryColor,
    backgroundColor: defaultColors.bg9,
    ...GStyles.paddingArg(2, 8),
  },
  transactionDataSection: {
    marginTop: pTd(16),
  },
  scrollSection: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    width: screenWidth,
    height: screenHeight / 2,
  },
  blank: {
    height: pTd(100),
  },
  error: {
    color: defaultColors.error,
    textAlign: 'left',
    marginTop: pTd(8),
  },
});

export const transferGroupStyle = StyleSheet.create({
  tokenCount: {
    marginTop: pTd(4),
    fontSize: pTd(28),
    textAlign: 'center',
  },
  tokenWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    width: pTd(20),
    marginRight: pTd(8),
  },
  smallLoadingIcon: {
    width: pTd(12),
    marginRight: pTd(4),
  },
  tokenUSD: {
    color: defaultColors.font3,
    textAlign: 'center',
    marginTop: pTd(4),
    width: pTd(335),
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    borderRadius: pTd(6),
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    lineHeight: pTd(20),
  },
  divider: {
    marginTop: pTd(24),
    width: pTd(335),
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border6,
  },
  card: {
    marginTop: pTd(24),
    width: pTd(335),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  marginTop0: {
    marginTop: 0,
  },
});
