import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
  },
  headerHelpIcon: {
    marginRight: pTd(16),
  },
  topIconWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    width: pTd(64),
    height: pTd(64),
    marginTop: pTd(36),
    marginRight: 'auto',
    marginBottom: pTd(16),
    marginLeft: 'auto',
    borderRadius: pTd(200),
    backgroundColor: theme.colors.bgBrand2,
  },
  amountInfoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: pTd(24),
    marginBottom: pTd(24),
  },
  amountAboveWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  amountAbove: {
    ...fonts.BGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(32),
  },
  amountBelow: {
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoWrap: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
  },
  nftInfoRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pTd(24),
  },
  nftInfoLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  nftInfoName: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  nftInfoCollection: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  nftInfoRight: {
    flexShrink: 0,
    width: pTd(42),
    height: pTd(42),
    marginLeft: pTd(8),
    borderRadius: pTd(8),
  },
  footerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase3,
    fontSize: pTd(12),
    lineHeight: pTd(12),
    marginRight: pTd(4),
  },
}));
