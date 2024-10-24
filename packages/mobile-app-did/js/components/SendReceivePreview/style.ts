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
  sendIconWrap: {
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
  amountAboveFirst: {
    marginRight: pTd(6),
  },
  amountBelow: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoWrap: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
  },
  infoLabelColumnWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoLabelWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoLabelHelpIcon: {
    marginLeft: pTd(4),
  },
  infoLabelAbove: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  infoValueColumnWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  infoValueWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  infoValueAbove: {
    ...fonts.SGRegularFont,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  infoValueLeftIcon: {
    width: pTd(18),
    height: pTd(18),
    marginRight: pTd(4),
  },
  infoErrorText: {
    color: theme.colors.textDanger2,
  },
  footerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...fonts.SGRegularFont,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: pTd(12),
    lineHeight: pTd(12),
    marginRight: pTd(4),
  },
}));
