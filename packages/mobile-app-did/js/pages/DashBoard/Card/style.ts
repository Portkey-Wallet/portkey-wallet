import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from 'assets/theme/fonts';
import { makeStyles } from '@rneui/themed';

export const getStyles = makeStyles(theme => ({
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
  svgWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    height: pTd(44),
  },
  titleLoading: {
    width: pTd(205),
    height: pTd(38),
    backgroundColor: theme.colors.bgBase3,
    borderRadius: pTd(4),
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
    ...fonts.BGMediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(38),
    height: pTd(38),
    color: theme.colors.textBase1,
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
}));
